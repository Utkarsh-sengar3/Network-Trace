import pandas as pd
from pathlib import Path


# ============================================================
# 1. PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATA_DIR = PROJECT_ROOT / "data"

CRIME_DIR = DATA_DIR / "crime_context"

RESULTS_DIR = (
    PROJECT_ROOT /
    "results" /
    "crime_context"
)

RESULTS_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# 2. FIND CSV FILES
# ============================================================

csv_files = list(
    CRIME_DIR.glob("*.csv")
)

if not csv_files:

    print("=" * 60)
    print("NO CRIME DATASET FOUND")
    print("=" * 60)

    print(
        "\nPut the Crime in India CSV file inside:"
    )

    print(
        CRIME_DIR
    )

    print(
        "\nThen run this script again."
    )

    raise SystemExit


print("=" * 60)
print("CRIME CONTEXT ANALYSIS")
print("=" * 60)

print("\nAvailable CSV files:")

for i, file in enumerate(
    csv_files,
    start=1
):

    print(
        f"{i}. {file.name}"
    )


# ============================================================
# 3. LOAD FIRST CSV
# ============================================================

crime_file = csv_files[0]

print(
    f"\nLoading: {crime_file.name}"
)

df = pd.read_csv(
    crime_file
)

print(
    f"Rows: {len(df):,}"
)

print(
    f"Columns: {len(df.columns)}"
)


# ============================================================
# 4. DISPLAY SCHEMA
# ============================================================

print("\n" + "=" * 60)
print("DATASET COLUMNS")
print("=" * 60)

for column in df.columns:

    print(
        f"- {column}"
    )


# ============================================================
# 5. BASIC DATA QUALITY
# ============================================================

print("\n" + "=" * 60)
print("DATA QUALITY")
print("=" * 60)

print(
    "\nMissing values:"
)

print(
    df.isnull()
    .sum()
    .sort_values(
        ascending=False
    )
    .head(20)
)


print(
    "\nDuplicate rows:",
    df.duplicated().sum()
)


# ============================================================
# 6. DATA TYPES
# ============================================================

print("\n" + "=" * 60)
print("DATA TYPES")
print("=" * 60)

print(
    df.dtypes
)


# ============================================================
# 7. NUMERIC SUMMARY
# ============================================================

print("\n" + "=" * 60)
print("NUMERIC SUMMARY")
print("=" * 60)

print(
    df.describe(
        include="all"
    ).transpose().head(20)
)


# ============================================================
# 8. SAVE CLEAN INSPECTION
# ============================================================

schema = pd.DataFrame({

    "column": df.columns,

    "dtype": [
        str(df[col].dtype)
        for col in df.columns
    ],

    "missing_values": [
        df[col].isnull().sum()
        for col in df.columns
    ],

    "unique_values": [
        df[col].nunique()
        for col in df.columns
    ]

})


schema_file = (
    RESULTS_DIR /
    "crime_dataset_schema.csv"
)

schema.to_csv(
    schema_file,
    index=False
)


# ============================================================
# 9. SAVE DATASET SUMMARY
# ============================================================

summary = pd.DataFrame([{

    "rows": len(df),

    "columns": len(df.columns),

    "duplicate_rows":
        df.duplicated().sum(),

    "total_missing_values":
        df.isnull().sum().sum()

}])


summary_file = (
    RESULTS_DIR /
    "crime_dataset_summary.csv"
)

summary.to_csv(
    summary_file,
    index=False
)


# ============================================================
# 10. FINISHED
# ============================================================

print("\n" + "=" * 60)
print("FILES SAVED")
print("=" * 60)

print(
    f"\nSchema:\n{schema_file}"
)

print(
    f"\nSummary:\n{summary_file}"
)

print(
    "\nPhase 9 dataset inspection completed."
)