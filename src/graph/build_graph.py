from pathlib import Path
import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt


# =========================================================
# CONFIGURATION
# =========================================================

DATA_DIR = Path("data/processed")

EGO_ID = "100129275726588145876"


# =========================================================
# LOAD EDGES FOR ONE EGO NETWORK
# =========================================================

print("=" * 60)
print("NETWORKTRACE - GRAPH CONSTRUCTION")
print("=" * 60)

print(f"\nLoading ego network:")
print(EGO_ID)

edges_path = DATA_DIR / "edges.csv"

df = pd.read_csv(
    edges_path,
    dtype=str
)

# Select only our ego network
ego_edges = df[
    df["ego_id"] == EGO_ID
]

print(f"\nEdges loaded: {len(ego_edges):,}")


# =========================================================
# CREATE GRAPH
# =========================================================

print("\nBuilding NetworkX graph...")

G = nx.Graph()

for _, row in ego_edges.iterrows():

    G.add_edge(
        row["source"],
        row["target"]
    )


# =========================================================
# GRAPH STATISTICS
# =========================================================

print("\n" + "=" * 60)
print("GRAPH STATISTICS")
print("=" * 60)

print(f"Nodes              : {G.number_of_nodes():,}")
print(f"Edges              : {G.number_of_edges():,}")

print(
    f"Average degree     : "
    f"{sum(dict(G.degree()).values()) / G.number_of_nodes():.2f}"
)

print(
    f"Density            : "
    f"{nx.density(G):.6f}"
)

print(
    f"Connected components: "
    f"{nx.number_connected_components(G)}"
)


# =========================================================
# LARGEST COMPONENT
# =========================================================

largest_component = max(
    nx.connected_components(G),
    key=len
)

LCC = G.subgraph(
    largest_component
).copy()

print("\nLargest connected component")
print("-" * 60)

print(f"Nodes              : {LCC.number_of_nodes():,}")
print(f"Edges              : {LCC.number_of_edges():,}")


# =========================================================
# DEGREE ANALYSIS
# =========================================================

degrees = dict(G.degree())

top_nodes = sorted(
    degrees.items(),
    key=lambda x: x[1],
    reverse=True
)[:10]

print("\nTop 10 nodes by degree")
print("-" * 60)

for node, degree in top_nodes:

    print(
        f"{node} → degree {degree}"
    )


# =========================================================
# VISUALIZATION
# =========================================================

print("\nCreating graph visualization...")

# For visualization, use a smaller sample
sample_nodes = list(LCC.nodes())[:200]

sample_graph = LCC.subgraph(
    sample_nodes
).copy()

plt.figure(figsize=(12, 10))

pos = nx.spring_layout(
    sample_graph,
    seed=42
)

nx.draw_networkx(
    sample_graph,
    pos,
    node_size=30,
    with_labels=False,
    width=0.3
)

plt.title(
    "NetworkTrace - GPlus Ego Network Sample"
)

plt.axis("off")

output_path = Path(
    "data/processed/ego_network_graph.png"
)

plt.savefig(
    output_path,
    dpi=200,
    bbox_inches="tight"
)

plt.close()

print(f"\nGraph saved to: {output_path}")

print("\n" + "=" * 60)
print("GRAPH CONSTRUCTION COMPLETE")
print("=" * 60)
