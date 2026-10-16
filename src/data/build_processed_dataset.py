from pathlib import Path
import csv


# =========================================================
# PATHS
# =========================================================

RAW_DIR = Path("data/raw/gplus")
OUTPUT_DIR = Path("data/processed")

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# =========================================================
# OUTPUT FILES
# =========================================================

nodes_file = OUTPUT_DIR / "nodes.csv"
edges_file = OUTPUT_DIR / "edges.csv"
communities_file = OUTPUT_DIR / "communities.csv"
ego_networks_file = OUTPUT_DIR / "ego_networks.csv"


# =========================================================
# PROCESS DATA
# =========================================================

def build_dataset():

    edge_files = sorted(RAW_DIR.glob("*.edges"))

    print("=" * 60)
    print("       NETWORKTRACE - BUILD PROCESSED DATASET")
    print("=" * 60)

    print(f"\nEgo networks found: {len(edge_files)}")

    total_nodes = 0
    total_edges = 0
    total_communities = 0

    # Track nodes globally
    all_nodes = {}

    # -----------------------------------------------------
    # Open output files
    # -----------------------------------------------------

    with open(
        nodes_file,
        "w",
        newline="",
        encoding="utf-8"
    ) as nf, \
    open(
        edges_file,
        "w",
        newline="",
        encoding="utf-8"
    ) as ef, \
    open(
        communities_file,
        "w",
        newline="",
        encoding="utf-8"
    ) as cf, \
    open(
        ego_networks_file,
        "w",
        newline="",
        encoding="utf-8"
    ) as egof:

        nodes_writer = csv.writer(nf)
        edges_writer = csv.writer(ef)
        communities_writer = csv.writer(cf)
        ego_writer = csv.writer(egof)

        # Headers
        nodes_writer.writerow([
            "node_id",
            "ego_id"
        ])

        edges_writer.writerow([
            "source",
            "target",
            "ego_id"
        ])

        communities_writer.writerow([
            "ego_id",
            "circle_id",
            "node_id"
        ])

        ego_writer.writerow([
            "ego_id",
            "node_count",
            "edge_count",
            "circle_count"
        ])

        # -------------------------------------------------
        # Process every ego network
        # -------------------------------------------------

        for index, edge_file in enumerate(edge_files, start=1):

            ego_id = edge_file.stem

            local_nodes = set()
            local_edges = set()

            # =============================================
            # EDGES
            # =============================================

            with open(
                edge_file,
                "r",
                encoding="utf-8"
            ) as f:

                for line in f:

                    parts = line.strip().split()

                    if len(parts) < 2:
                        continue

                    source = parts[0]
                    target = parts[1]

                    local_nodes.add(source)
                    local_nodes.add(target)

                    edge = tuple(sorted([
                        source,
                        target
                    ]))

                    # Remove duplicate edges
                    if edge not in local_edges:

                        local_edges.add(edge)

                        edges_writer.writerow([
                            source,
                            target,
                            ego_id
                        ])

            # =============================================
            # FEATURES → NODE LIST
            # =============================================

            feat_file = RAW_DIR / f"{ego_id}.feat"

            if feat_file.exists():

                with open(
                    feat_file,
                    "r",
                    encoding="utf-8"
                ) as f:

                    for line in f:

                        parts = line.strip().split()

                        if not parts:
                            continue

                        node_id = parts[0]

                        local_nodes.add(node_id)

            # =============================================
            # WRITE NODES
            # =============================================

            for node_id in local_nodes:

                nodes_writer.writerow([
                    node_id,
                    ego_id
                ])

                all_nodes[node_id] = True

            # =============================================
            # CIRCLES
            # =============================================

            circles_file = RAW_DIR / f"{ego_id}.circles"

            circle_count = 0

            if circles_file.exists():

                with open(
                    circles_file,
                    "r",
                    encoding="utf-8"
                ) as f:

                    for line in f:

                        parts = line.strip().split()

                        if len(parts) < 2:
                            continue

                        circle_id = parts[0]

                        members = parts[1:]

                        circle_count += 1
                        total_communities += 1

                        for node_id in members:

                            communities_writer.writerow([
                                ego_id,
                                circle_id,
                                node_id
                            ])

            # =============================================
            # EGO SUMMARY
            # =============================================

            node_count = len(local_nodes)
            edge_count = len(local_edges)

            ego_writer.writerow([
                ego_id,
                node_count,
                edge_count,
                circle_count
            ])

            total_nodes += node_count
            total_edges += edge_count

            # Progress
            if index % 10 == 0 or index == len(edge_files):

                print(
                    f"Processed {index}/{len(edge_files)} "
                    f"ego networks..."
                )

    # =====================================================
    # FINAL REPORT
    # =====================================================

    print("\n" + "=" * 60)
    print("DATASET BUILD COMPLETE")
    print("=" * 60)

    print(f"\nTotal node records : {total_nodes}")
    print(f"Unique nodes       : {len(all_nodes)}")
    print(f"Total edges        : {total_edges}")
    print(f"Total communities  : {total_communities}")

    print("\nGenerated files:")

    print(f"  {nodes_file}")
    print(f"  {edges_file}")
    print(f"  {communities_file}")
    print(f"  {ego_networks_file}")

    print("\n" + "=" * 60)


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":
    build_dataset()