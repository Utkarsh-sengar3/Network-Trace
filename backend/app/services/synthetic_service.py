import pandas as pd
import networkx as nx
from typing import List, Dict, Any, Optional
from pathlib import Path
from ..config import SYNTHETIC_DATA_DIR, SYNTHETIC_RESULTS_DIR

class SyntheticService:
    def __init__(self):
        self._initialized = False
        self.nodes_df: pd.DataFrame = pd.DataFrame()
        self.edges_df: pd.DataFrame = pd.DataFrame()
        self.analytics_df: pd.DataFrame = pd.DataFrame()
        self.bridge_df: pd.DataFrame = pd.DataFrame()
        self.communities_df: pd.DataFrame = pd.DataFrame()
        self.summary_df: pd.DataFrame = pd.DataFrame()
        self.G: nx.Graph = nx.Graph()

    def load_data(self):
        if self._initialized:
            return

        print("Initializing SyntheticService & loading synthetic criminal network...")

        nodes_file = SYNTHETIC_DATA_DIR / "criminal_network_nodes.csv"
        if nodes_file.exists():
            self.nodes_df = pd.read_csv(nodes_file)

        edges_file = SYNTHETIC_DATA_DIR / "criminal_network_edges.csv"
        if edges_file.exists():
            self.edges_df = pd.read_csv(edges_file)

        analytics_file = SYNTHETIC_RESULTS_DIR / "synthetic_node_analytics.csv"
        if analytics_file.exists():
            self.analytics_df = pd.read_csv(analytics_file)

        bridges_file = SYNTHETIC_RESULTS_DIR / "synthetic_bridge_nodes.csv"
        if bridges_file.exists():
            self.bridge_df = pd.read_csv(bridges_file)

        comm_file = SYNTHETIC_RESULTS_DIR / "synthetic_communities.csv"
        if comm_file.exists():
            self.communities_df = pd.read_csv(comm_file)

        self.G = nx.Graph()
        if not self.edges_df.empty:
            for _, r in self.edges_df.iterrows():
                self.G.add_edge(str(r["source"]), str(r["target"]), rel_type=str(r.get("relationship_type", "connection")))

        self._initialized = True

    def get_network(self) -> Dict[str, Any]:
        self.load_data()
        
        # Merge node types, analytics, and community info
        bridge_set = set(self.bridge_df["node_id"].astype(str).tolist()) if not self.bridge_df.empty else set()
        
        merged_nodes = []
        for _, r in self.nodes_df.iterrows():
            nid = str(r["node_id"])
            ntype = str(r["node_type"])
            is_br = nid in bridge_set
            
            # Fetch betweenness & degree if available
            deg = self.G.degree(nid) if nid in self.G else 0
            bet = 0.0
            cid = 0
            
            if not self.analytics_df.empty:
                match = self.analytics_df[self.analytics_df["node_id"].astype(str) == nid]
                if not match.empty:
                    deg = int(match.iloc[0].get("degree", deg))
                    bet = float(match.iloc[0].get("betweenness_centrality", 0.0))

            if not self.communities_df.empty:
                match_c = self.communities_df[self.communities_df["node_id"].astype(str) == nid]
                if not match_c.empty:
                    cid = int(match_c.iloc[0].get("community_id", 0))

            merged_nodes.append({
                "node_id": nid,
                "node_type": ntype,
                "community_id": cid,
                "degree": deg,
                "betweenness_centrality": round(bet, 5),
                "is_bridge": is_br,
                "connected_types": list(set([self.nodes_df[self.nodes_df['node_id'] == v]['node_type'].values[0] for v in self.G.neighbors(nid)])) if nid in self.G else []
            })

        edge_items = []
        for _, r in self.edges_df.iterrows():
            rel = str(r.get("relationship", r.get("relationship_type", "communication")))
            edge_items.append({
                "source": str(r["source"]),
                "target": str(r["target"]),
                "relationship_type": rel,
                "weight": 1.0
            })

        rel_col = "relationship" if "relationship" in self.edges_df.columns else "relationship_type" if "relationship_type" in self.edges_df.columns else None
        rel_breakdown = self.edges_df[rel_col].value_counts().to_dict() if (rel_col and not self.edges_df.empty) else {}

        summary = {
            "total_entities": len(self.nodes_df),
            "people_count": len(self.nodes_df[self.nodes_df["node_type"] == "person"]),
            "organizations_count": len(self.nodes_df[self.nodes_df["node_type"] == "organization"]),
            "locations_count": len(self.nodes_df[self.nodes_df["node_type"] == "location"]),
            "total_relationships": len(self.edges_df),
            "relationship_breakdown": rel_breakdown,
            "bridge_entities_count": len(bridge_set),
            "disclaimer": "Synthetic Demonstration — Generated purely for algorithm validation. Entities do not represent real persons or organizations."
        }

        return {
            "nodes": merged_nodes,
            "edges": edge_items,
            "summary": summary
        }

    def get_summary(self) -> Dict[str, Any]:
        data = self.get_network()
        return data["summary"]

synthetic_service = SyntheticService()
