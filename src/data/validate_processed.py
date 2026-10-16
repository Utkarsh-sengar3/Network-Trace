from pathlib import Path
import pandas as pd

DATA_DIR = Path("data/processed")

files = [
    "nodes.csv",
    "edges.csv",
    "communities.csv",
    "ego_networks.csv"
]

print("=" * 60)
print("NETWORKTRACE - PROCESSED DATA VALIDATION")
print("=" * 60)

for filename in files:

    path = DATA_DIR / filename

    print(f"\n{filename}")
    print("-" * 60)

    if not path.exists():
        print("ERROR: File not found")
        continue

    df = pd.read_csv(path)

    print(f"Rows    : {len(df):,}")
    print(f"Columns : {len(df.columns)}")
    print(f"Shape   : {df.shape}")

    print("\nColumns:")
    print(list(df.columns))

    print("\nFirst 5 rows:")
    print(df.head().to_string(index=False))

print("\n" + "=" * 60)
print("VALIDATION COMPLETE")
print("=" * 60)