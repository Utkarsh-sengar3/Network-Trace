import pandas as pd
import networkx as nx
from typing import List, Dict, Any, Optional, Set
from pathlib import Path
from ..config import (
    PROCESSED_DATA_DIR,
    COMMUNITY_RESULTS_DIR,
    INTELLIGENCE_RESULTS_DIR,
    ANALYTICS_RESULTS_DIR,
    EVALUATION_RESULTS_DIR,
    GPLUS_RAW_DIR,
    EGO_ID,
    COMMUNITY_COLORS,
)

class GraphService:
    def __init__(self):
        self._initialized = False
        self.G: nx.Graph = nx.Graph()
        self.nodes_df: pd.DataFrame = pd.DataFrame()
        self.edges_df: pd.DataFrame = pd.DataFrame()
        self.communities_df: pd.DataFrame = pd.DataFrame()
        self.centrality_df: pd.DataFrame = pd.DataFrame()
        self.bridges_df: pd.DataFrame = pd.DataFrame()
        self.evaluation_df: pd.DataFrame = pd.DataFrame()
        self.community_profiles_df: pd.DataFrame = pd.DataFrame()
        self.community_connections_df: pd.DataFrame = pd.DataFrame()
        self.node_lookup: Dict[str, Dict[str, Any]] = {}
        self.bridge_set: Set[str] = set()

    def load_data(self):
        if self._initialized:
            return

        print("Initializing GraphService & loading network data...")

        # 1. Load centrality results
        centrality_file = ANALYTICS_RESULTS_DIR / "network_centrality.csv"
        if centrality_file.exists():
            self.centrality_df = pd.read_csv(centrality_file, dtype={"node_id": str})
        else:
            self.centrality_df = pd.DataFrame()

        # 2. Load Louvain communities
        comm_file = COMMUNITY_RESULTS_DIR / "louvain_communities.csv"
        if comm_file.exists():
            self.communities_df = pd.read_csv(comm_file, dtype={"node_id": str})
            self.communities_df["community_id"] = self.communities_df["community_id"].astype(int)
        else:
            self.communities_df = pd.DataFrame()

        # 3. Load bridge nodes
        bridge_file = INTELLIGENCE_RESULTS_DIR / "bridge_nodes.csv"
        if bridge_file.exists():
            self.bridges_df = pd.read_csv(bridge_file, dtype={"node_id": str})
            self.bridge_set = set(self.bridges_df["node_id"].tolist())
        else:
            self.bridges_df = pd.DataFrame()
            self.bridge_set = set()

        # 4. Load Community Profiles & Connections
        profiles_file = INTELLIGENCE_RESULTS_DIR / "community_profiles.csv"
        if profiles_file.exists():
            self.community_profiles_df = pd.read_csv(profiles_file)
        
        connections_file = INTELLIGENCE_RESULTS_DIR / "community_connections.csv"
        if connections_file.exists():
            self.community_connections_df = pd.read_csv(connections_file)

        eval_file = EVALUATION_RESULTS_DIR / "louvain_circle_comparison.csv"
        if eval_file.exists():
            self.evaluation_df = pd.read_csv(eval_file)

        # 5. Load Edges for the selected ego network
        raw_ego_edges_file = GPLUS_RAW_DIR / f"{EGO_ID}.edges"
        if raw_ego_edges_file.exists():
            self.edges_df = pd.read_csv(
                raw_ego_edges_file,
                sep=r"\s+",
                names=["source", "target"],
                dtype={"source": str, "target": str}
            )
        else:
            edges_file = PROCESSED_DATA_DIR / "edges.csv"
            if edges_file.exists():
                edges_raw = pd.read_csv(
                    edges_file,
                    dtype={"source": str, "target": str, "ego_id": str}
                )
                self.edges_df = edges_raw[edges_raw["ego_id"] == EGO_ID][["source", "target"]].copy()
            else:
                self.edges_df = pd.DataFrame(columns=["source", "target"])

        # 6. Build Master Node Lookup Table
        # Merge centrality + community
        merged_nodes = pd.merge(
            self.centrality_df,
            self.communities_df[["node_id", "community_id"]],
            on="node_id",
            how="left"
        )
        merged_nodes["community_id"] = merged_nodes["community_id"].fillna(0).astype(int)
        
        # Build NetworkX Graph
        self.G = nx.Graph()
        for row in self.edges_df.itertuples(index=False):
            self.G.add_edge(row.source, row.target)

        for _, row in merged_nodes.iterrows():
            nid = str(row["node_id"])
            cid = int(row["community_id"])
            is_br = nid in self.bridge_set
            color = COMMUNITY_COLORS[cid % len(COMMUNITY_COLORS)]

            node_data = {
                "node_id": nid,
                "community_id": cid,
                "degree": int(row["degree"]) if "degree" in row and not pd.isna(row["degree"]) else self.G.degree(nid) if nid in self.G else 0,
                "degree_centrality": float(row.get("degree_centrality", 0.0)),
                "betweenness_centrality": float(row.get("betweenness_centrality", 0.0)),
                "closeness_centrality": float(row.get("closeness_centrality", 0.0)),
                "pagerank": float(row.get("pagerank", 0.0)),
                "is_bridge": is_br,
                "color": color,
                "connected_communities_count": 1,
                "connected_communities": [cid]
            }
            self.node_lookup[nid] = node_data
            if nid in self.G:
                self.G.nodes[nid].update(node_data)

        # Enrich bridge node connected communities from bridge_nodes.csv if present
        if not self.bridges_df.empty and "connected_communities" in self.bridges_df.columns:
            for _, b_row in self.bridges_df.iterrows():
                b_nid = str(b_row["node_id"])
                if b_nid in self.node_lookup:
                    conns = b_row["connected_communities"]
                    if isinstance(conns, str):
                        try:
                            # Evaluate list string like "[0, 1, 2]"
                            comm_list = [int(x.strip()) for x in conns.replace("[", "").replace("]", "").split(",") if x.strip()]
                            self.node_lookup[b_nid]["connected_communities"] = comm_list
                            self.node_lookup[b_nid]["connected_communities_count"] = len(comm_list)
                        except Exception:
                            pass

        self._initialized = True
        print(f"GraphService initialized with {self.G.number_of_nodes()} nodes and {self.G.number_of_edges()} edges.")

    def get_summary(self) -> Dict[str, Any]:
        self.load_data()
        num_nodes = len(self.node_lookup)
        num_edges = len(self.edges_df)
        avg_deg = sum(d["degree"] for d in self.node_lookup.values()) / max(num_nodes, 1)
        density = (2 * num_edges) / (num_nodes * (num_nodes - 1)) if num_nodes > 1 else 0

        components = list(nx.connected_components(self.G)) if self.G.number_of_nodes() > 0 else []
        num_comp = len(components)
        largest_comp_size = max(len(c) for c in components) if components else 0
        communities_count = len(self.communities_df["community_id"].unique()) if not self.communities_df.empty else 0

        return {
            "ego_id": EGO_ID,
            "total_nodes": num_nodes,
            "total_edges": num_edges,
            "average_degree": round(avg_deg, 2),
            "density": round(density, 6),
            "connected_components": num_comp,
            "largest_component_size": largest_comp_size,
            "community_count": communities_count,
            "bridge_node_count": len(self.bridge_set)
        }

    def get_nodes(self, community_id: Optional[int] = None, is_bridge: Optional[bool] = None, search: Optional[str] = None, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        self.load_data()
        results = list(self.node_lookup.values())

        if community_id is not None:
            results = [n for n in results if n["community_id"] == community_id]
        if is_bridge is not None:
            results = [n for n in results if n["is_bridge"] == is_bridge]
        if search:
            s = search.lower()
            results = [n for n in results if s in n["node_id"].lower()]

        total = len(results)
        paginated = results[offset : offset + limit]
        return {
            "total": total,
            "offset": offset,
            "limit": limit,
            "nodes": paginated
        }

    def get_node_detail(self, node_id: str) -> Optional[Dict[str, Any]]:
        self.load_data()
        if node_id not in self.node_lookup:
            return None
        
        info = dict(self.node_lookup[node_id])
        # Find neighbors
        if node_id in self.G:
            neighbors = list(self.G.neighbors(node_id))
            neighbor_details = []
            for n_nid in neighbors[:50]: # top 50 for detail view
                if n_nid in self.node_lookup:
                    neighbor_details.append({
                        "node_id": n_nid,
                        "community_id": self.node_lookup[n_nid]["community_id"],
                        "degree": self.node_lookup[n_nid]["degree"],
                        "is_bridge": self.node_lookup[n_nid]["is_bridge"],
                        "color": self.node_lookup[n_nid]["color"]
                    })
            info["neighbors_count"] = len(neighbors)
            info["neighbors_sample"] = neighbor_details
        else:
            info["neighbors_count"] = 0
            info["neighbors_sample"] = []

        return info

    def get_neighborhood(self, node_id: str, hops: int = 1, max_nodes: int = 150) -> Dict[str, Any]:
        self.load_data()
        if node_id not in self.G:
            return {"nodes": [], "edges": [], "root_node": node_id}

        sub_nodes = {node_id}
        current_layer = {node_id}
        for _ in range(hops):
            next_layer = set()
            for n in current_layer:
                next_layer.update(self.G.neighbors(n))
            sub_nodes.update(next_layer)
            current_layer = next_layer
            if len(sub_nodes) >= max_nodes:
                break

        # Extract induced subgraph
        subgraph = self.G.subgraph(list(sub_nodes)[:max_nodes])
        node_items = [self.node_lookup[n] for n in subgraph.nodes() if n in self.node_lookup]
        edge_items = []
        for u, v in subgraph.edges():
            u_comm = self.node_lookup.get(u, {}).get("community_id", -1)
            v_comm = self.node_lookup.get(v, {}).get("community_id", -1)
            edge_items.append({
                "source": u,
                "target": v,
                "weight": 1.0,
                "is_cross_community": u_comm != v_comm
            })

        return {
            "root_node": node_id,
            "hops": hops,
            "nodes": node_items,
            "edges": edge_items
        }

    def get_graph_view(self, community_id: Optional[int] = None, max_nodes: int = 500, max_edges: int = 1500) -> Dict[str, Any]:
        """
        Level-Of-Detail optimized graph view payload.
        Ensures high FPS rendering on Cytoscape.js while keeping community clusters and bridge nodes clear.
        """
        self.load_data()
        
        if community_id is not None:
            # Community isolation mode
            comm_nodes = [nid for nid, data in self.node_lookup.items() if data["community_id"] == community_id]
            sub = self.G.subgraph(comm_nodes)
            nodes_to_render = [self.node_lookup[n] for n in sub.nodes()]
            edges_to_render = []
            for u, v in list(sub.edges())[:max_edges]:
                edges_to_render.append({
                    "source": u,
                    "target": v,
                    "weight": 1.0,
                    "is_cross_community": False
                })
            return {
                "nodes": nodes_to_render,
                "edges": edges_to_render,
                "total_graph_nodes": len(self.node_lookup),
                "total_graph_edges": len(self.edges_df),
                "sampled": len(edges_to_render) < sub.number_of_edges()
            }

        # Global macro view: prioritize bridge nodes, top degree anchors, and representative community members
        selected_nodes = set()
        
        # 1. Add all bridge nodes
        selected_nodes.update(self.bridge_set)

        # 2. Add top 25 degree nodes from each community
        for cid in range(8):
            comm_nodes = [nid for nid, d in self.node_lookup.items() if d["community_id"] == cid]
            comm_nodes_sorted = sorted(comm_nodes, key=lambda x: self.node_lookup[x]["degree"], reverse=True)
            selected_nodes.update(comm_nodes_sorted[:25])

        # Fill remaining slots up to max_nodes with top betweenness / pagerank
        if len(selected_nodes) < max_nodes:
            top_central = sorted(self.node_lookup.keys(), key=lambda x: self.node_lookup[x]["betweenness_centrality"], reverse=True)
            for nid in top_central:
                selected_nodes.add(nid)
                if len(selected_nodes) >= max_nodes:
                    break

        sub = self.G.subgraph(list(selected_nodes))
        nodes_to_render = [self.node_lookup[n] for n in sub.nodes() if n in self.node_lookup]

        # Prioritize cross-community and high-centrality edges
        edge_candidates = []
        for u, v in sub.edges():
            u_data = self.node_lookup.get(u, {})
            v_data = self.node_lookup.get(v, {})
            is_cross = u_data.get("community_id") != v_data.get("community_id")
            score = (2.0 if is_cross else 1.0) + (1.5 if (u in self.bridge_set or v in self.bridge_set) else 0.0)
            edge_candidates.append((score, u, v, is_cross))

        edge_candidates.sort(key=lambda x: x[0], reverse=True)
        edges_to_render = [
            {
                "source": u,
                "target": v,
                "weight": 1.0,
                "is_cross_community": is_cross
            }
            for _, u, v, is_cross in edge_candidates[:max_edges]
        ]

        return {
            "nodes": nodes_to_render,
            "edges": edges_to_render,
            "total_graph_nodes": len(self.node_lookup),
            "total_graph_edges": len(self.edges_df),
            "sampled": True
        }

    def get_communities(self) -> List[Dict[str, Any]]:
        self.load_data()
        communities_list = []
        unique_comms = sorted(self.communities_df["community_id"].unique())

        for cid in unique_comms:
            cid = int(cid)
            members = [nid for nid, d in self.node_lookup.items() if d["community_id"] == cid]
            size = len(members)
            
            # Subgraph for internal edge calculation
            sub = self.G.subgraph(members)
            internal_edges = sub.number_of_edges()
            total_edges = sum(self.G.degree(m) for m in members if m in self.G)
            external_edges = max(0, total_edges - (2 * internal_edges))
            density = (2 * internal_edges) / (size * (size - 1)) if size > 1 else 0

            # Top anchors by degree inside community
            top_anchors = sorted(members, key=lambda x: self.node_lookup[x]["degree"], reverse=True)[:5]
            top_anchor_items = [self.node_lookup[a] for a in top_anchors]

            # Bridge nodes in this community
            comm_bridges = [m for m in members if m in self.bridge_set]
            top_bridges = sorted(comm_bridges, key=lambda x: self.node_lookup[x]["betweenness_centrality"], reverse=True)[:5]
            top_bridge_items = [self.node_lookup[b] for b in top_bridges]

            communities_list.append({
                "community_id": cid,
                "size": size,
                "color": COMMUNITY_COLORS[cid % len(COMMUNITY_COLORS)],
                "density": round(density, 4),
                "internal_edges": internal_edges,
                "external_edges": external_edges,
                "top_anchor_nodes": top_anchor_items,
                "top_bridge_nodes": top_bridge_items
            })

        return communities_list

    def get_community_detail(self, community_id: int) -> Optional[Dict[str, Any]]:
        comms = self.get_communities()
        for c in comms:
            if c["community_id"] == community_id:
                # Add connection details to other communities from results if available
                inter_connections = []
                if not self.community_connections_df.empty:
                    df_c = self.community_connections_df[
                        (self.community_connections_df["community_1"] == community_id) |
                        (self.community_connections_df["community_2"] == community_id)
                    ]
                    inter_connections = df_c.to_dict(orient="records")
                c["inter_community_connections"] = inter_connections
                return c
        return None

    def get_bridges(self) -> List[Dict[str, Any]]:
        self.load_data()
        bridge_nodes_data = []
        for nid in self.bridge_set:
            if nid in self.node_lookup:
                b_info = self.node_lookup[nid]
                bridge_nodes_data.append(b_info)
        
        # Sort by betweenness centrality descending
        bridge_nodes_data.sort(key=lambda x: x["betweenness_centrality"], reverse=True)
        return bridge_nodes_data

    def get_shortest_path(self, source: str, target: str) -> Dict[str, Any]:
        self.load_data()
        if source not in self.G or target not in self.G:
            return {
                "found": False,
                "path": [],
                "length": 0,
                "nodes": [],
                "edges": [],
                "message": f"Node {source if source not in self.G else target} does not exist in graph."
            }

        try:
            path = nx.shortest_path(self.G, source=source, target=target)
            nodes = [self.node_lookup[n] for n in path if n in self.node_lookup]
            edges = []
            for i in range(len(path) - 1):
                u, v = path[i], path[i+1]
                edges.append({
                    "source": u,
                    "target": v,
                    "weight": 1.0,
                    "is_cross_community": self.node_lookup.get(u, {}).get("community_id") != self.node_lookup.get(v, {}).get("community_id")
                })
            return {
                "found": True,
                "path": path,
                "length": len(path) - 1,
                "nodes": nodes,
                "edges": edges,
                "message": f"Shortest path found with {len(path) - 1} hops."
            }
        except nx.NetworkXNoPath:
            return {
                "found": False,
                "path": [],
                "length": 0,
                "nodes": [],
                "edges": [],
                "message": "No connecting path exists between these two nodes."
            }

    def get_centrality_distributions(self) -> Dict[str, Any]:
        self.load_data()
        if self.centrality_df.empty:
            return {}
        
        return {
            "degree_distribution": self.centrality_df["degree"].describe().to_dict(),
            "betweenness_distribution": self.centrality_df["betweenness_centrality"].describe().to_dict(),
            "closeness_distribution": self.centrality_df["closeness_centrality"].describe().to_dict(),
            "pagerank_distribution": self.centrality_df["pagerank"].describe().to_dict(),
            "top_degree": self.centrality_df.sort_values("degree", ascending=False).head(10).to_dict(orient="records"),
            "top_betweenness": self.centrality_df.sort_values("betweenness_centrality", ascending=False).head(10).to_dict(orient="records"),
            "top_pagerank": self.centrality_df.sort_values("pagerank", ascending=False).head(10).to_dict(orient="records"),
            "evaluation_metrics": self.evaluation_df.to_dict(orient="records") if not self.evaluation_df.empty else []
        }

graph_service = GraphService()
