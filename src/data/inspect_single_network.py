from pathlib import Path

DATA_DIR = Path("data/raw/gplus")

# Pick the first ego network
edge_file = next(DATA_DIR.glob("*.edges"))

ego_id = edge_file.stem

print("=" * 60)
print("NETWORKTRACE - SINGLE EGO NETWORK INSPECTION")
print("=" * 60)

print(f"\nEgo Network ID: {ego_id}")

# ---------------------------------------------------------
# FILES
# ---------------------------------------------------------

files = {
    "Edges": DATA_DIR / f"{ego_id}.edges",
    "Features": DATA_DIR / f"{ego_id}.feat",
    "Ego Features": DATA_DIR / f"{ego_id}.egofeat",
    "Feature Names": DATA_DIR / f"{ego_id}.featnames",
    "Circles": DATA_DIR / f"{ego_id}.circles",
}

print("\nFILES")
print("-" * 60)

for name, path in files.items():
    print(f"{name:20} : {'FOUND' if path.exists() else 'MISSING'}")


# ---------------------------------------------------------
# EDGES
# ---------------------------------------------------------

print("\nEDGES")
print("-" * 60)

edges = []

with open(files["Edges"], "r", encoding="utf-8") as f:

    for line in f:

        parts = line.strip().split()

        if len(parts) >= 2:
            edges.append((parts[0], parts[1]))

print(f"Total edges: {len(edges)}")

print("\nFirst 5 edges:")

for edge in edges[:5]:
    print(edge)


# ---------------------------------------------------------
# FEATURES
# ---------------------------------------------------------

print("\nFEATURES")
print("-" * 60)

features = []

with open(files["Features"], "r", encoding="utf-8") as f:

    for line in f:

        parts = line.strip().split()

        if parts:
            features.append(parts)

print(f"Feature rows: {len(features)}")

if features:

    print(f"Features per node: {len(features[0]) - 1}")

    print("\nFirst feature row:")

    print(features[0][:10], "...")


# ---------------------------------------------------------
# FEATURE NAMES
# ---------------------------------------------------------

print("\nFEATURE NAMES")
print("-" * 60)

feature_names = []

with open(files["Feature Names"], "r", encoding="utf-8") as f:

    for line in f:

        line = line.strip()

        if line:
            feature_names.append(line)

print(f"Feature names: {len(feature_names)}")

print("\nFirst 5 feature names:")

for name in feature_names[:5]:
    print(name)


# ---------------------------------------------------------
# CIRCLES
# ---------------------------------------------------------

print("\nKNOWN SOCIAL CIRCLES")
print("-" * 60)

circles = []

with open(files["Circles"], "r", encoding="utf-8") as f:

    for line in f:

        parts = line.strip().split()

        if len(parts) >= 2:

            circle_name = parts[0]
            members = parts[1:]

            circles.append(
                (circle_name, members)
            )

print(f"Number of circles: {len(circles)}")

for circle_name, members in circles[:5]:

    print(
        f"{circle_name}: "
        f"{len(members)} members"
    )


# ---------------------------------------------------------
# SUMMARY
# ---------------------------------------------------------

print("\n" + "=" * 60)
print("SINGLE NETWORK INSPECTION COMPLETE")
print("=" * 60)