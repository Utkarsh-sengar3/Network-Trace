import pandas as pd
import networkx as nx
from pathlib import Path
from community import community_louvain


# ============================================================
# 1. PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

SYNTHETIC_DIR = (
    PROJECT_ROOT / "data" / "synthetic"
)

RESULTS_DIR = (
    PROJECT_ROOT /
    "results" /
    "synthetic_criminal_network"
)

RESULTS_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# 2. FILES
# ============================================================

NODES_FILE = (
    SYNTHETIC_DIR /
    "criminal_network_nodes.csv"
)

EDGES_FILE = (
    SYNTHETIC_DIR /
    "criminal_network_edges.csv"
)


# ============================================================
# 3. LOAD DATA
# ============================================================

print("=" * 60)
print("SYNTHETIC CRIMINAL NETWORK ANALYSIS")
print("=" * 60)

print("\nLoading synthetic data...")

nodes_df = pd.read_csv(
    NODES_FILE,
    dtype=str
)

edges_df = pd.read_csv(
    EDGES_FILE,
    dtype=str
)

print(
    f"Node records: {len(nodes_df)}"
)

print(
    f"Edge records: {len(edges_df)}"
)


# ============================================================
# 4. BUILD GRAPH
# ============================================================

print("\nBuilding graph...")

G = nx.Graph()

for _, row in edges_df.iterrows():

    G.add_edge(
        row["source"],
        row["target"],
        relationship=row["relationship"]
    )

print(
    f"Graph nodes: {G.number_of_nodes()}"
)

print(
    f"Graph edges: {G.number_of_edges()}"
)

print(
    f"Connected components: "
    f"{nx.number_connected_components(G)}"
)


# ============================================================
# 5. LOUVAIN COMMUNITY DETECTION
# ============================================================

print("\nRunning Louvain community detection...")

partition = community_louvain.best_partition(
    G,
    random_state=42
)

modularity = community_louvain.modularity(
    partition,
    G
)

community_df = pd.DataFrame([
    {
        "node_id": node,
        "community_id": community
    }
    for node, community in partition.items()
])

print(
    f"Communities detected: "
    f"{community_df['community_id'].nunique()}"
)

print(
    f"Modularity: "
    f"{modularity:.4f}"
)


# ============================================================
# 6. CENTRALITY ANALYSIS
# ============================================================

print("\nCalculating centrality metrics...")

degree = dict(G.degree())

degree_centrality = nx.degree_centrality(G)

betweenness = nx.betweenness_centrality(
    G,
    normalized=True
)

closeness = nx.closeness_centrality(
    G
)

pagerank = nx.pagerank(
    G,
    alpha=0.85
)


# ============================================================
# 7. CREATE NODE ANALYTICS TABLE
# ============================================================

node_analytics = pd.DataFrame({

    "node_id": list(G.nodes()),

    "degree": [
        degree[node]
        for node in G.nodes()
    ],

    "degree_centrality": [
        degree_centrality[node]
        for node in G.nodes()
    ],

    "betweenness_centrality": [
        betweenness[node]
        for node in G.nodes()
    ],

    "closeness_centrality": [
        closeness[node]
        for node in G.nodes()
    ],

    "pagerank": [
        pagerank[node]
        for node in G.nodes()
    ]
})


# ============================================================
# 8. ADD NODE TYPE
# ============================================================

node_analytics = node_analytics.merge(
    nodes_df[
        [
            "node_id",
            "node_type"
        ]
    ],
    on="node_id",
    how="left"
)


# ============================================================
# 9. ADD COMMUNITY
# ============================================================

node_analytics = node_analytics.merge(
    community_df,
    on="node_id",
    how="left"
)


# ============================================================
# 10. SAVE COMMUNITY ASSIGNMENTS
# ============================================================

community_file = (
    RESULTS_DIR /
    "synthetic_communities.csv"
)

community_df.to_csv(
    community_file,
    index=False
)


# ============================================================
# 11. SAVE NODE ANALYTICS
# ============================================================

analytics_file = (
    RESULTS_DIR /
    "synthetic_node_analytics.csv"
)

node_analytics.to_csv(
    analytics_file,
    index=False
)


# ============================================================
# 12. COMMUNITY PROFILES
# ============================================================

community_profiles = (
    node_analytics
    .groupby("community_id")
    .agg(
        community_size=(
            "node_id",
            "count"
        ),

        average_degree=(
            "degree",
            "mean"
        ),

        average_betweenness=(
            "betweenness_centrality",
            "mean"
        ),

        maximum_betweenness=(
            "betweenness_centrality",
            "max"
        ),

        average_pagerank=(
            "pagerank",
            "mean"
        ),

        maximum_pagerank=(
            "pagerank",
            "max"
        )
    )
    .reset_index()
)


community_profiles_file = (
    RESULTS_DIR /
    "synthetic_community_profiles.csv"
)

community_profiles.to_csv(
    community_profiles_file,
    index=False
)


# ============================================================
# 13. FIND BRIDGE NODES
# ============================================================

print("\nFinding bridge nodes...")

node_to_community = dict(
    zip(
        community_df["node_id"],
        community_df["community_id"]
    )
)

bridge_nodes = []

for node in G.nodes():

    own_community = node_to_community.get(
        node
    )

    connected_communities = set()

    for neighbor in G.neighbors(node):

        neighbor_community = (
            node_to_community.get(neighbor)
        )

        if (
            neighbor_community is not None
            and neighbor_community != own_community
        ):

            connected_communities.add(
                neighbor_community
            )

    if connected_communities:

        row = node_analytics[
            node_analytics["node_id"] == node
        ].iloc[0]

        bridge_nodes.append({

            "node_id": node,

            "node_type":
                row["node_type"],

            "community_id":
                own_community,

            "connected_communities":
                len(connected_communities),

            "neighboring_communities":
                ",".join(
                    map(
                        str,
                        sorted(
                            connected_communities
                        )
                    )
                ),

            "degree":
                row["degree"],

            "betweenness_centrality":
                row[
                    "betweenness_centrality"
                ],

            "pagerank":
                row["pagerank"]

        })


bridge_df = pd.DataFrame(
    bridge_nodes
)


if not bridge_df.empty:

    bridge_df = bridge_df.sort_values(
        [
            "connected_communities",
            "betweenness_centrality"
        ],
        ascending=False
    )


bridge_file = (
    RESULTS_DIR /
    "synthetic_bridge_nodes.csv"
)

bridge_df.to_csv(
    bridge_file,
    index=False
)


# ============================================================
# 14. TOP CENTRAL ENTITIES
# ============================================================

top_degree = (
    node_analytics
    .sort_values(
        "degree",
        ascending=False
    )
    .head(10)
)

top_betweenness = (
    node_analytics
    .sort_values(
        "betweenness_centrality",
        ascending=False
    )
    .head(10)
)

top_pagerank = (
    node_analytics
    .sort_values(
        "pagerank",
        ascending=False
    )
    .head(10)
)


# ============================================================
# 15. DISPLAY RESULTS
# ============================================================

print("\n" + "=" * 60)
print("COMMUNITY RESULTS")
print("=" * 60)

print(
    community_profiles.to_string(
        index=False
    )
)


print("\n" + "=" * 60)
print("TOP DEGREE ENTITIES")
print("=" * 60)

print(
    top_degree[
        [
            "node_id",
            "node_type",
            "degree",
            "community_id"
        ]
    ].to_string(index=False)
)


print("\n" + "=" * 60)
print("TOP BETWEENNESS ENTITIES")
print("=" * 60)

print(
    top_betweenness[
        [
            "node_id",
            "node_type",
            "degree",
            "betweenness_centrality",
            "community_id"
        ]
    ].to_string(index=False)
)


print("\n" + "=" * 60)
print("TOP PAGERANK ENTITIES")
print("=" * 60)

print(
    top_pagerank[
        [
            "node_id",
            "node_type",
            "pagerank",
            "community_id"
        ]
    ].to_string(index=False)
)


print("\n" + "=" * 60)
print("BRIDGE ENTITIES")
print("=" * 60)

if not bridge_df.empty:

    print(
        bridge_df.head(15).to_string(
            index=False
        )
    )

else:

    print(
        "No bridge entities detected."
    )


# ============================================================
# 16. SAVE SUMMARY
# ============================================================

summary = pd.DataFrame([{

    "nodes": G.number_of_nodes(),

    "edges": G.number_of_edges(),

    "connected_components":
        nx.number_connected_components(G),

    "communities":
        community_df[
            "community_id"
        ].nunique(),

    "modularity":
        modularity,

    "bridge_entities":
        len(bridge_df)

}])


summary_file = (
    RESULTS_DIR /
    "synthetic_network_summary.csv"
)

summary.to_csv(
    summary_file,
    index=False
)


# ============================================================
# 17. FINAL
# ============================================================

print("\n" + "=" * 60)
print("FILES SAVED")
print("=" * 60)

print(
    f"\nCommunities:\n{community_file}"
)

print(
    f"\nNode analytics:\n{analytics_file}"
)

print(
    f"\nCommunity profiles:\n"
    f"{community_profiles_file}"
)

print(
    f"\nBridge entities:\n{bridge_file}"
)

print(
    f"\nSummary:\n{summary_file}"
)

print(
    "\nPhase 8 synthetic network analysis completed."
)