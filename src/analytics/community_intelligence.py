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
COMMUNITY_DIR = RESULTS_DIR / "community_detection"
ANALYTICS_DIR = RESULTS_DIR / "network_analytics"

INTELLIGENCE_DIR = (
    RESULTS_DIR / "community_intelligence"
)

INTELLIGENCE_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# 2. SETTINGS
# ============================================================

EGO_ID = "100129275726588145876"

TOP_N = 10


# ============================================================
# 3. LOAD CENTRALITY RESULTS
# ============================================================

print("=" * 60)
print("COMMUNITY INTELLIGENCE")
print("=" * 60)

print("\nLoading centrality results...")

centrality_file = (
    ANALYTICS_DIR /
    "network_centrality.csv"
)

centrality = pd.read_csv(
    centrality_file,
    dtype={"node_id": str}
)

print(
    f"Centrality records: "
    f"{len(centrality):,}"
)


# ============================================================
# 4. LOAD LOUVAIN COMMUNITIES
# ============================================================

print("\nLoading Louvain communities...")

community_file = (
    COMMUNITY_DIR /
    "louvain_communities.csv"
)

communities = pd.read_csv(
    community_file,
    dtype={"node_id": str}
)

communities["community_id"] = (
    communities["community_id"].astype(int)
)

print(
    f"Community records: "
    f"{len(communities):,}"
)

print(
    f"Number of communities: "
    f"{communities['community_id'].nunique()}"
)


# ============================================================
# 5. MERGE COMMUNITY + CENTRALITY
# ============================================================

print("\nCombining community and centrality information...")

node_data = communities.merge(
    centrality,
    on="node_id",
    how="inner"
)

print(
    f"Combined node records: "
    f"{len(node_data):,}"
)


# ============================================================
# 6. COMMUNITY PROFILES
# ============================================================

print("\nCreating community profiles...")

community_profiles = (
    node_data
    .groupby("community_id")
    .agg(
        community_size=("node_id", "count"),

        avg_degree=("degree", "mean"),

        max_degree=("degree", "max"),

        avg_betweenness=(
            "betweenness_centrality",
            "mean"
        ),

        max_betweenness=(
            "betweenness_centrality",
            "max"
        ),

        avg_closeness=(
            "closeness_centrality",
            "mean"
        ),

        avg_pagerank=(
            "pagerank",
            "mean"
        ),

        max_pagerank=(
            "pagerank",
            "max"
        )
    )
    .reset_index()
)


# ============================================================
# 7. IDENTIFY KEY NODE IN EACH COMMUNITY
# ============================================================

print("\nIdentifying key nodes...")

key_nodes = []

for community_id, group in node_data.groupby(
    "community_id"
):

    # Node with highest PageRank
    pagerank_node = group.loc[
        group["pagerank"].idxmax()
    ]

    # Node with highest degree
    degree_node = group.loc[
        group["degree"].idxmax()
    ]

    # Node with highest betweenness
    betweenness_node = group.loc[
        group["betweenness_centrality"].idxmax()
    ]

    key_nodes.append({

        "community_id": community_id,

        "pagerank_node":
            pagerank_node["node_id"],

        "pagerank_score":
            pagerank_node["pagerank"],

        "degree_node":
            degree_node["node_id"],

        "degree":
            degree_node["degree"],

        "betweenness_node":
            betweenness_node["node_id"],

        "betweenness_score":
            betweenness_node[
                "betweenness_centrality"
            ]

    })


community_key_nodes = pd.DataFrame(
    key_nodes
)


# ============================================================
# 8. LOAD GRAPH EDGES
# ============================================================

print("\nLoading graph edges...")

edges_file = (
    PROCESSED_DIR / "edges.csv"
)

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
    f"Edges loaded: "
    f"{len(edges):,}"
)


# ============================================================
# 9. CREATE NODE → COMMUNITY MAPPING
# ============================================================

node_to_community = dict(
    zip(
        communities["node_id"],
        communities["community_id"]
    )
)


# ============================================================
# 10. BUILD INTER-COMMUNITY CONNECTIONS
# ============================================================

print("\nAnalyzing connections between communities...")

community_connections = {}

for source, target in edges.itertuples(
    index=False,
    name=None
):

    source_community = node_to_community.get(
        source
    )

    target_community = node_to_community.get(
        target
    )

    # Ignore nodes without a community assignment
    if (
        source_community is None
        or target_community is None
    ):
        continue

    # Ignore internal community edges
    if source_community == target_community:
        continue

    # Sort pair so A-B and B-A are the same
    community_pair = tuple(
        sorted(
            [
                source_community,
                target_community
            ]
        )
    )

    community_connections[
        community_pair
    ] = (
        community_connections.get(
            community_pair,
            0
        ) + 1
    )


connection_rows = []

for (
    community_pair,
    edge_count
) in community_connections.items():

    community_a = community_pair[0]
    community_b = community_pair[1]

    connection_rows.append({

        "community_a":
            community_a,

        "community_b":
            community_b,

        "inter_community_edges":
            edge_count
    })


community_connections_df = pd.DataFrame(
    connection_rows
)


if not community_connections_df.empty:

    community_connections_df = (
        community_connections_df
        .sort_values(
            "inter_community_edges",
            ascending=False
        )
    )


# ============================================================
# 11. IDENTIFY BRIDGE NODES
# ============================================================

print("\nIdentifying bridge nodes...")

G = nx.Graph()

G.add_edges_from(
    edges.itertuples(
        index=False,
        name=None
    )
)

bridge_data = []

for node in G.nodes():

    node_community = node_to_community.get(
        node
    )

    if node_community is None:
        continue

    neighboring_communities = set()

    for neighbor in G.neighbors(node):

        neighbor_community = (
            node_to_community.get(neighbor)
        )

        if (
            neighbor_community is not None
            and neighbor_community != node_community
        ):

            neighboring_communities.add(
                neighbor_community
            )

    if neighboring_communities:

        row = node_data[
            node_data["node_id"] == node
        ]

        if row.empty:
            continue

        row = row.iloc[0]

        bridge_data.append({

            "node_id":
                node,

            "community_id":
                node_community,

            "connected_communities":
                len(neighboring_communities),

            "neighboring_community_ids":
                ",".join(
                    map(
                        str,
                        sorted(
                            neighboring_communities
                        )
                    )
                ),

            "degree":
                row["degree"],

            "betweenness_centrality":
                row[
                    "betweenness_centrality"
                ],

            "closeness_centrality":
                row[
                    "closeness_centrality"
                ],

            "pagerank":
                row["pagerank"]

        })


bridge_nodes = pd.DataFrame(
    bridge_data
)


# ============================================================
# 12. RANK BRIDGE NODES
# ============================================================

if not bridge_nodes.empty:

    bridge_nodes = bridge_nodes.sort_values(
        [
            "connected_communities",
            "betweenness_centrality"
        ],
        ascending=False
    )


# ============================================================
# 13. SAVE COMMUNITY PROFILES
# ============================================================

community_profiles_file = (
    INTELLIGENCE_DIR /
    "community_profiles.csv"
)

community_profiles.to_csv(
    community_profiles_file,
    index=False
)


# ============================================================
# 14. SAVE KEY NODES
# ============================================================

key_nodes_file = (
    INTELLIGENCE_DIR /
    "community_key_nodes.csv"
)

community_key_nodes.to_csv(
    key_nodes_file,
    index=False
)


# ============================================================
# 15. SAVE BRIDGE NODES
# ============================================================

bridge_nodes_file = (
    INTELLIGENCE_DIR /
    "bridge_nodes.csv"
)

bridge_nodes.to_csv(
    bridge_nodes_file,
    index=False
)


# ============================================================
# 16. SAVE COMMUNITY CONNECTIONS
# ============================================================

connections_file = (
    INTELLIGENCE_DIR /
    "community_connections.csv"
)

community_connections_df.to_csv(
    connections_file,
    index=False
)


# ============================================================
# 17. DISPLAY COMMUNITY PROFILES
# ============================================================

print("\n" + "=" * 60)
print("COMMUNITY PROFILES")
print("=" * 60)

print(
    community_profiles.to_string(
        index=False
    )
)


# ============================================================
# 18. DISPLAY KEY NODES
# ============================================================

print("\n" + "=" * 60)
print("KEY NODES BY COMMUNITY")
print("=" * 60)

print(
    community_key_nodes.to_string(
        index=False
    )
)


# ============================================================
# 19. DISPLAY TOP BRIDGE NODES
# ============================================================

print("\n" + "=" * 60)
print("TOP BRIDGE NODES")
print("=" * 60)

if not bridge_nodes.empty:

    print(
        bridge_nodes.head(TOP_N).to_string(
            index=False
        )
    )

else:

    print(
        "No bridge nodes found."
    )


# ============================================================
# 20. DISPLAY COMMUNITY CONNECTIONS
# ============================================================

print("\n" + "=" * 60)
print("TOP COMMUNITY CONNECTIONS")
print("=" * 60)

if not community_connections_df.empty:

    print(
        community_connections_df
        .head(TOP_N)
        .to_string(index=False)
    )

else:

    print(
        "No inter-community connections found."
    )


# ============================================================
# 21. FINAL
# ============================================================

print("\n" + "=" * 60)
print("FILES SAVED")
print("=" * 60)

print(
    f"\nCommunity profiles:\n"
    f"{community_profiles_file}"
)

print(
    f"\nCommunity key nodes:\n"
    f"{key_nodes_file}"
)

print(
    f"\nBridge nodes:\n"
    f"{bridge_nodes_file}"
)

print(
    f"\nCommunity connections:\n"
    f"{connections_file}"
)

print(
    "\nPhase 7 Community Intelligence completed."
)