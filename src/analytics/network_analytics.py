import pandas as pd
import networkx as nx
from pathlib import Path


# ============================================================
# 1. PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATA_DIR = PROJECT_ROOT / "data"
RESULTS_DIR = PROJECT_ROOT / "results"

PROCESSED_DIR = DATA_DIR / "processed"
ANALYTICS_DIR = RESULTS_DIR / "network_analytics"

ANALYTICS_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# 2. SETTINGS
# ============================================================

EGO_ID = "100129275726588145876"

TOP_N = 20


# ============================================================
# 3. LOAD EDGES
# ============================================================

edges_file = PROCESSED_DIR / "edges.csv"

print("=" * 60)
print("NETWORK ANALYTICS")
print("=" * 60)

print("\nLoading edges...")

# IMPORTANT:
# edges.csv is very large, so load only the selected ego network.
edges = pd.read_csv(
    edges_file,
    dtype={
        "source": str,
        "target": str,
        "ego_id": str
    }
)

edges = edges[
    edges["ego_id"] == EGO_ID
][
    ["source", "target"]
]

print(
    f"Edges loaded: {len(edges):,}"
)


# ============================================================
# 4. BUILD GRAPH
# ============================================================

print("\nBuilding NetworkX graph...")

G = nx.Graph()

G.add_edges_from(
    edges.itertuples(
        index=False,
        name=None
    )
)

print(
    f"Nodes: {G.number_of_nodes():,}"
)

print(
    f"Edges: {G.number_of_edges():,}"
)


# ============================================================
# 5. BASIC GRAPH STATISTICS
# ============================================================

print("\nCalculating basic statistics...")

average_degree = sum(
    dict(G.degree()).values()
) / G.number_of_nodes()

density = nx.density(G)

components = list(
    nx.connected_components(G)
)

largest_component = max(
    components,
    key=len
)

print(
    f"Average degree: {average_degree:.2f}"
)

print(
    f"Density: {density:.6f}"
)

print(
    f"Connected components: {len(components)}"
)

print(
    f"Largest component: "
    f"{len(largest_component):,} nodes"
)


# ============================================================
# 6. DEGREE CENTRALITY
# ============================================================

print("\nCalculating Degree Centrality...")

degree_centrality = nx.degree_centrality(G)


# ============================================================
# 7. BETWEEENNESS CENTRALITY
# ============================================================

print("Calculating Betweenness Centrality...")

# For this network, exact betweenness is still manageable.
betweenness_centrality = nx.betweenness_centrality(
    G,
    normalized=True
)


# ============================================================
# 8. CLOSENESS CENTRALITY
# ============================================================

print("Calculating Closeness Centrality...")

closeness_centrality = nx.closeness_centrality(
    G
)


# ============================================================
# 9. PAGERANK
# ============================================================

print("Calculating PageRank...")

pagerank = nx.pagerank(
    G,
    alpha=0.85
)


# ============================================================
# 10. COMBINE RESULTS
# ============================================================

analytics_df = pd.DataFrame({

    "node_id": list(G.nodes()),

    "degree": [
        G.degree(node)
        for node in G.nodes()
    ],

    "degree_centrality": [
        degree_centrality[node]
        for node in G.nodes()
    ],

    "betweenness_centrality": [
        betweenness_centrality[node]
        for node in G.nodes()
    ],

    "closeness_centrality": [
        closeness_centrality[node]
        for node in G.nodes()
    ],

    "pagerank": [
        pagerank[node]
        for node in G.nodes()
    ]

})


# ============================================================
# 11. SORT BY DEGREE
# ============================================================

top_degree = analytics_df.sort_values(
    "degree",
    ascending=False
).head(TOP_N)


# ============================================================
# 12. SORT BY BETWEENNESS
# ============================================================

top_betweenness = analytics_df.sort_values(
    "betweenness_centrality",
    ascending=False
).head(TOP_N)


# ============================================================
# 13. SORT BY CLOSENESS
# ============================================================

top_closeness = analytics_df.sort_values(
    "closeness_centrality",
    ascending=False
).head(TOP_N)


# ============================================================
# 14. SORT BY PAGERANK
# ============================================================

top_pagerank = analytics_df.sort_values(
    "pagerank",
    ascending=False
).head(TOP_N)


# ============================================================
# 15. SAVE COMPLETE ANALYTICS
# ============================================================

analytics_file = (
    ANALYTICS_DIR /
    "network_centrality.csv"
)

analytics_df.to_csv(
    analytics_file,
    index=False
)


# ============================================================
# 16. SAVE TOP NODE TABLES
# ============================================================

top_degree.to_csv(
    ANALYTICS_DIR /
    "top_degree_nodes.csv",
    index=False
)

top_betweenness.to_csv(
    ANALYTICS_DIR /
    "top_betweenness_nodes.csv",
    index=False
)

top_closeness.to_csv(
    ANALYTICS_DIR /
    "top_closeness_nodes.csv",
    index=False
)

top_pagerank.to_csv(
    ANALYTICS_DIR /
    "top_pagerank_nodes.csv",
    index=False
)


# ============================================================
# 17. DISPLAY TOP RESULTS
# ============================================================

print("\n" + "=" * 60)
print("TOP DEGREE NODES")
print("=" * 60)

print(
    top_degree[
        [
            "node_id",
            "degree",
            "degree_centrality"
        ]
    ].to_string(index=False)
)


print("\n" + "=" * 60)
print("TOP BETWEENNESS NODES")
print("=" * 60)

print(
    top_betweenness[
        [
            "node_id",
            "degree",
            "betweenness_centrality"
        ]
    ].to_string(index=False)
)


print("\n" + "=" * 60)
print("TOP CLOSENESS NODES")
print("=" * 60)

print(
    top_closeness[
        [
            "node_id",
            "closeness_centrality"
        ]
    ].to_string(index=False)
)


print("\n" + "=" * 60)
print("TOP PAGERANK NODES")
print("=" * 60)

print(
    top_pagerank[
        [
            "node_id",
            "pagerank"
        ]
    ].to_string(index=False)
)


# ============================================================
# 18. FINISHED
# ============================================================

print("\n" + "=" * 60)
print("FILES SAVED")
print("=" * 60)

print(
    f"\nComplete analytics:\n"
    f"{analytics_file}"
)

print(
    f"\nResults directory:\n"
    f"{ANALYTICS_DIR}"
)

print("\nPhase 6 Network Analytics completed.")