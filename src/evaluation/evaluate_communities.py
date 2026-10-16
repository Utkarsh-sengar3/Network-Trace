import pandas as pd
from pathlib import Path

# ==============================
# PROJECT PATHS
# ==============================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATA_DIR = PROJECT_ROOT / "data"
RESULTS_DIR = PROJECT_ROOT / "results"

GPLUS_DIR = DATA_DIR / "raw" / "gplus"
COMMUNITY_DIR = RESULTS_DIR / "community_detection"
EVALUATION_DIR = RESULTS_DIR / "evaluation"

EVALUATION_DIR.mkdir(parents=True, exist_ok=True)


# ==============================
# SETTINGS
# ==============================

EGO_ID = "100129275726588145876"


# ==============================
# LOAD LOUVAIN RESULTS
# ==============================

louvain_file = COMMUNITY_DIR / "louvain_communities.csv"

print("Loading Louvain results...")

louvain_results = pd.read_csv(
    louvain_file,
    dtype=str
)

louvain_results["node_id"] = (
    louvain_results["node_id"].astype(str)
)

louvain_results["community_id"] = (
    louvain_results["community_id"].astype(int)
)

print(
    f"Louvain nodes: {len(louvain_results)}"
)

print(
    f"Detected communities: "
    f"{louvain_results['community_id'].nunique()}"
)


# ==============================
# LOAD KNOWN CIRCLES
# ==============================

circle_file = GPLUS_DIR / f"{EGO_ID}.circles"

print("\nLoading known circles...")

circles = {}

with open(circle_file, "r", encoding="utf-8") as f:

    for line in f:

        parts = line.strip().split()

        if len(parts) >= 2:

            circle_id = parts[0]

            circle_nodes = set(parts[1:])

            circles[circle_id] = circle_nodes


print(f"Known circles: {len(circles)}")

for circle_id, nodes in circles.items():

    print(
        f"  {circle_id}: "
        f"{len(nodes)} members"
    )


# ==============================
# COMPARE COMMUNITIES
# ==============================

print(
    "\nComparing Louvain communities "
    "with known circles..."
)

comparison = []

for community_id, group in louvain_results.groupby(
    "community_id"
):

    detected_nodes = set(
        group["node_id"]
    )

    for circle_id, circle_nodes in circles.items():

        overlap = detected_nodes & circle_nodes

        union = detected_nodes | circle_nodes

        # Jaccard Similarity
        jaccard = (
            len(overlap) / len(union)
            if union else 0
        )

        # Circle Coverage
        coverage = (
            len(overlap) / len(circle_nodes)
            if circle_nodes else 0
        )

        # Community Precision
        precision = (
            len(overlap) / len(detected_nodes)
            if detected_nodes else 0
        )

        comparison.append({

            "ego_id": EGO_ID,

            "community_id": community_id,

            "circle_id": circle_id,

            "community_size": len(
                detected_nodes
            ),

            "circle_size": len(
                circle_nodes
            ),

            "overlap": len(
                overlap
            ),

            "jaccard": jaccard,

            "circle_coverage": coverage,

            "community_precision": precision
        })


# ==============================
# CREATE DATAFRAME
# ==============================

comparison_df = pd.DataFrame(
    comparison
)

comparison_df = comparison_df.sort_values(
    by="jaccard",
    ascending=False
)


# ==============================
# BEST MATCH FOR EACH CIRCLE
# ==============================

best_matches = (
    comparison_df
    .sort_values(
        "jaccard",
        ascending=False
    )
    .groupby("circle_id")
    .first()
    .reset_index()
)


# ==============================
# SAVE RESULTS
# ==============================

comparison_file = (
    EVALUATION_DIR /
    "louvain_circle_comparison.csv"
)

best_matches_file = (
    EVALUATION_DIR /
    "louvain_best_matches.csv"
)

comparison_df.to_csv(
    comparison_file,
    index=False
)

best_matches.to_csv(
    best_matches_file,
    index=False
)


# ==============================
# DISPLAY RESULTS
# ==============================

print("\n" + "=" * 60)
print("COMMUNITY EVALUATION RESULTS")
print("=" * 60)

print("\nBest Louvain matches:")

print(
    best_matches[
        [
            "circle_id",
            "community_id",
            "community_size",
            "circle_size",
            "overlap",
            "jaccard",
            "circle_coverage",
            "community_precision"
        ]
    ].to_string(index=False)
)


# ==============================
# CIRCLE OVERLAP
# ==============================

print("\n" + "=" * 60)
print("KNOWN CIRCLE OVERLAP")
print("=" * 60)

circle_ids = list(circles.keys())

if len(circle_ids) >= 2:

    circle_a = circles[circle_ids[0]]

    circle_b = circles[circle_ids[1]]

    overlap = circle_a & circle_b

    print(
        f"\n{circle_ids[0]} members: "
        f"{len(circle_a)}"
    )

    print(
        f"{circle_ids[1]} members: "
        f"{len(circle_b)}"
    )

    print(
        f"Overlapping members: "
        f"{len(overlap)}"
    )


# ==============================
# FINAL
# ==============================

print("\n" + "=" * 60)
print("FILES SAVED")
print("=" * 60)

print(
    f"\n{comparison_file}"
)

print(
    f"\n{best_matches_file}"
)

print("\nPhase 5 evaluation completed.")