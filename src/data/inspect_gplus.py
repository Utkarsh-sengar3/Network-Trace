from pathlib import Path
from collections import defaultdict

# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------

DATA_DIR = Path("data/raw/gplus")


# ---------------------------------------------------------
# HELPER
# ---------------------------------------------------------

def get_files(extension):
    return list(DATA_DIR.glob(f"*{extension}"))


# ---------------------------------------------------------
# MAIN INSPECTION
# ---------------------------------------------------------

def inspect_dataset():

    print("=" * 60)
    print("        NETWORKTRACE - GPLUS DATASET REPORT")
    print("=" * 60)

    if not DATA_DIR.exists():
        print("\nERROR: Dataset folder not found.")
        print("Expected:", DATA_DIR.resolve())
        return

    # -----------------------------------------------------
    # FILE COUNTS
    # -----------------------------------------------------

    edges_files = get_files(".edges")
    feat_files = get_files(".feat")
    egofeat_files = get_files(".egofeat")
    featnames_files = get_files(".featnames")
    circles_files = get_files(".circles")
    followers_files = get_files(".followers")

    print("\nFILE COUNTS")
    print("-" * 60)

    print(f"Edges files       : {len(edges_files)}")
    print(f"Feature files     : {len(feat_files)}")
    print(f"Ego feature files : {len(egofeat_files)}")
    print(f"Feature-name files: {len(featnames_files)}")
    print(f"Circle files      : {len(circles_files)}")
    print(f"Follower files    : {len(followers_files)}")

    # -----------------------------------------------------
    # EDGE ANALYSIS
    # -----------------------------------------------------

    print("\nAnalyzing network edges...")

    total_edges = 0
    unique_nodes = set()
    self_loops = 0
    duplicate_edges = 0

    network_sizes = []

    for i, edge_file in enumerate(edges_files, start=1):

        local_edges = set()
        local_nodes = set()

        try:

            with open(edge_file, "r", encoding="utf-8") as f:

                for line in f:

                    line = line.strip()

                    if not line:
                        continue

                    parts = line.split()

                    if len(parts) < 2:
                        continue

                    source = parts[0]
                    target = parts[1]

                    total_edges += 1

                    unique_nodes.add(source)
                    unique_nodes.add(target)

                    local_nodes.add(source)
                    local_nodes.add(target)

                    if source == target:
                        self_loops += 1

                    edge = tuple(sorted((source, target)))

                    if edge in local_edges:
                        duplicate_edges += 1

                    local_edges.add(edge)

            network_sizes.append(
                (edge_file.stem, len(local_nodes), len(local_edges))
            )

        except Exception as e:

            print(f"ERROR reading {edge_file.name}: {e}")

        # Progress
        if i % 10 == 0:
            print(f"Processed {i}/{len(edges_files)} edge files...")

    # -----------------------------------------------------
    # CIRCLE ANALYSIS
    # -----------------------------------------------------

    print("\nAnalyzing communities...")

    total_circles = 0
    circle_sizes = []

    for circle_file in circles_files:

        try:

            with open(circle_file, "r", encoding="utf-8") as f:

                for line in f:

                    line = line.strip()

                    if not line:
                        continue

                    parts = line.split()

                    if len(parts) < 2:
                        continue

                    total_circles += 1

                    members = parts[1:]

                    circle_sizes.append(len(members))

        except Exception as e:

            print(f"ERROR reading {circle_file.name}: {e}")

    # -----------------------------------------------------
    # RESULTS
    # -----------------------------------------------------

    print("\n" + "=" * 60)
    print("NETWORK STATISTICS")
    print("=" * 60)

    print(f"Total edge records : {total_edges}")
    print(f"Unique nodes       : {len(unique_nodes)}")
    print(f"Self loops         : {self_loops}")
    print(f"Duplicate edges    : {duplicate_edges}")
    print(f"Known circles      : {total_circles}")

    # -----------------------------------------------------
    # NETWORK SIZE
    # -----------------------------------------------------

    if network_sizes:

        node_counts = [x[1] for x in network_sizes]
        edge_counts = [x[2] for x in network_sizes]

        largest_network = max(
            network_sizes,
            key=lambda x: x[1]
        )

        smallest_network = min(
            network_sizes,
            key=lambda x: x[1]
        )

        print("\nNETWORK SIZE")
        print("-" * 60)

        print(
            f"Average nodes / ego : "
            f"{sum(node_counts) / len(node_counts):.2f}"
        )

        print(
            f"Average edges / ego : "
            f"{sum(edge_counts) / len(edge_counts):.2f}"
        )

        print(
            f"Largest network     : "
            f"{largest_network[0]} "
            f"({largest_network[1]} nodes)"
        )

        print(
            f"Smallest network    : "
            f"{smallest_network[0]} "
            f"({smallest_network[1]} nodes)"
        )

    # -----------------------------------------------------
    # CIRCLE SIZE
    # -----------------------------------------------------

    if circle_sizes:

        print("\nCOMMUNITY STATISTICS")
        print("-" * 60)

        print(
            f"Average circle size : "
            f"{sum(circle_sizes) / len(circle_sizes):.2f}"
        )

        print(
            f"Largest circle      : "
            f"{max(circle_sizes)} members"
        )

        print(
            f"Smallest circle     : "
            f"{min(circle_sizes)} members"
        )

    # -----------------------------------------------------
    # FINAL
    # -----------------------------------------------------

    print("\n" + "=" * 60)
    print("DATASET INSPECTION COMPLETE")
    print("=" * 60)


# ---------------------------------------------------------
# RUN
# ---------------------------------------------------------

if __name__ == "__main__":
    inspect_dataset()