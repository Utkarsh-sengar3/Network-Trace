import pandas as pd
import networkx as nx
import random
from pathlib import Path


# ============================================================
# 1. PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

SYNTHETIC_DIR = (
    PROJECT_ROOT / "data" / "synthetic"
)

SYNTHETIC_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# 2. SETTINGS
# ============================================================

SEED = 42

random.seed(SEED)


# ============================================================
# 3. CREATE SYNTHETIC ENTITIES
# ============================================================

people = [
    f"P{i:03d}"
    for i in range(1, 61)
]

organizations = [
    "ORG_A",
    "ORG_B",
    "ORG_C"
]

locations = [
    "LOC_NORTH",
    "LOC_SOUTH",
    "LOC_EAST",
    "LOC_WEST"
]


# ============================================================
# 4. NODE TABLE
# ============================================================

nodes = []

for person in people:

    nodes.append({
        "node_id": person,
        "node_type": "person"
    })


for org in organizations:

    nodes.append({
        "node_id": org,
        "node_type": "organization"
    })


for location in locations:

    nodes.append({
        "node_id": location,
        "node_type": "location"
    })


nodes_df = pd.DataFrame(nodes)


# ============================================================
# 5. CREATE SYNTHETIC NETWORK
# ============================================================

edges = []


def add_edge(
    source,
    target,
    relationship
):

    edges.append({

        "source": source,

        "target": target,

        "relationship": relationship

    })


# ============================================================
# 6. CREATE THREE SYNTHETIC GROUPS
# ============================================================

group_a = people[0:20]
group_b = people[20:40]
group_c = people[40:60]


# ============================================================
# 7. INTERNAL COMMUNICATION NETWORK
# ============================================================

def create_group_connections(
    group,
    probability=0.25
):

    for i in range(len(group)):

        for j in range(
            i + 1,
            len(group)
        ):

            if random.random() < probability:

                add_edge(
                    group[i],
                    group[j],
                    "communication"
                )


create_group_connections(
    group_a,
    0.28
)

create_group_connections(
    group_b,
    0.28
)

create_group_connections(
    group_c,
    0.28
)


# ============================================================
# 8. ORGANIZATION ASSOCIATIONS
# ============================================================

for person in group_a:

    if random.random() < 0.75:

        add_edge(
            person,
            "ORG_A",
            "associated_with"
        )


for person in group_b:

    if random.random() < 0.75:

        add_edge(
            person,
            "ORG_B",
            "associated_with"
        )


for person in group_c:

    if random.random() < 0.75:

        add_edge(
            person,
            "ORG_C",
            "associated_with"
        )


# ============================================================
# 9. LOCATION ASSOCIATIONS
# ============================================================

for person in group_a:

    add_edge(
        person,
        "LOC_NORTH",
        "operates_in"
    )


for person in group_b:

    add_edge(
        person,
        "LOC_SOUTH",
        "operates_in"
    )


for person in group_c:

    add_edge(
        person,
        "LOC_EAST",
        "operates_in"
    )


# ============================================================
# 10. BRIDGE ENTITIES
# ============================================================

# These are intentionally created to connect
# otherwise separate synthetic groups.

bridge_edges = [

    (
        "P005",
        "P025",
        "cross_group_communication"
    ),

    (
        "P025",
        "P045",
        "cross_group_communication"
    ),

    (
        "P010",
        "P050",
        "cross_group_communication"
    ),

    (
        "P015",
        "P035",
        "cross_group_communication"
    ),

    (
        "P030",
        "P055",
        "cross_group_communication"
    )

]


for source, target, relationship in bridge_edges:

    add_edge(
        source,
        target,
        relationship
    )


# ============================================================
# 11. CROSS-ORGANIZATION ASSOCIATIONS
# ============================================================

add_edge(
    "P010",
    "ORG_B",
    "associated_with"
)

add_edge(
    "P025",
    "ORG_C",
    "associated_with"
)

add_edge(
    "P045",
    "ORG_A",
    "associated_with"
)


# ============================================================
# 12. CROSS-LOCATION RELATIONSHIPS
# ============================================================

add_edge(
    "P005",
    "LOC_SOUTH",
    "operates_in"
)

add_edge(
    "P025",
    "LOC_EAST",
    "operates_in"
)

add_edge(
    "P045",
    "LOC_NORTH",
    "operates_in"
)


# ============================================================
# 13. EDGE TABLE
# ============================================================

edges_df = pd.DataFrame(edges)


# Remove accidental duplicates

edges_df = edges_df.drop_duplicates(
    subset=[
        "source",
        "target",
        "relationship"
    ]
)


# ============================================================
# 14. SAVE DATA
# ============================================================

nodes_file = (
    SYNTHETIC_DIR /
    "criminal_network_nodes.csv"
)

edges_file = (
    SYNTHETIC_DIR /
    "criminal_network_edges.csv"
)


nodes_df.to_csv(
    nodes_file,
    index=False
)

edges_df.to_csv(
    edges_file,
    index=False
)


# ============================================================
# 15. BUILD GRAPH
# ============================================================

G = nx.Graph()

for _, row in edges_df.iterrows():

    G.add_edge(
        row["source"],
        row["target"],
        relationship=row["relationship"]
    )


# ============================================================
# 16. PRINT SUMMARY
# ============================================================

print("=" * 60)
print("SYNTHETIC CRIMINAL NETWORK")
print("=" * 60)

print(
    f"\nNodes: {len(nodes_df)}"
)

print(
    f"Edges: {len(edges_df)}"
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


print("\nNode types:")

print(
    nodes_df["node_type"]
    .value_counts()
)


print("\nRelationship types:")

print(
    edges_df["relationship"]
    .value_counts()
)


print("\nBridge relationships:")

print(
    edges_df[
        edges_df["relationship"]
        == "cross_group_communication"
    ].to_string(index=False)
)


print("\nFiles saved:")

print(nodes_file)

print(edges_file)


print(
    "\nPhase 8 synthetic network generation completed."
)