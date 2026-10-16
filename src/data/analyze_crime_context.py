import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DATA_DIR = os.path.join(BASE_DIR, "data", "crime_context")
RESULTS_DIR = os.path.join(BASE_DIR, "results", "crime_context")

os.makedirs(RESULTS_DIR, exist_ok=True)

FILE_NAME = "01_District_wise_crimes_committed_IPC_2001_2012.csv"
FILE_PATH = os.path.join(DATA_DIR, FILE_NAME)

print("=" * 60)
print("NETWORKTRACE - CRIME CONTEXT ANALYSIS")
print("=" * 60)

# --------------------------------------------------
# 1. Load dataset
# --------------------------------------------------

print("\nLoading dataset...")

df = pd.read_csv(FILE_PATH)

print(f"Rows: {len(df):,}")
print(f"Columns: {len(df.columns)}")

# --------------------------------------------------
# 2. Basic cleaning
# --------------------------------------------------

df.columns = df.columns.str.strip()

df["STATE/UT"] = df["STATE/UT"].astype(str).str.strip()
df["DISTRICT"] = df["DISTRICT"].astype(str).str.strip()

print("\nDataset loaded successfully.")

# --------------------------------------------------
# 3. State-level analysis
# --------------------------------------------------

state_summary = (
    df.groupby("STATE/UT")
    .agg(
        total_crimes=("TOTAL IPC CRIMES", "sum"),
        average_crimes=("TOTAL IPC CRIMES", "mean"),
        districts=("DISTRICT", "nunique"),
        years=("YEAR", "nunique")
    )
    .reset_index()
    .sort_values("total_crimes", ascending=False)
)

state_path = os.path.join(
    RESULTS_DIR,
    "state_crime_summary.csv"
)

state_summary.to_csv(state_path, index=False)

# --------------------------------------------------
# 4. District-level analysis
# --------------------------------------------------

df = df[df["DISTRICT"].str.upper() != "TOTAL"].copy()

district_summary = (
    df.groupby(["STATE/UT", "DISTRICT"])
    .agg(
        total_crimes=("TOTAL IPC CRIMES", "sum"),
        average_crimes=("TOTAL IPC CRIMES", "mean"),
        years=("YEAR", "nunique")
    )
    .reset_index()
    .sort_values("total_crimes", ascending=False)
)

district_path = os.path.join(
    RESULTS_DIR,
    "district_crime_summary.csv"
)

district_summary.to_csv(district_path, index=False)

# --------------------------------------------------
# 5. Yearly crime trends
# --------------------------------------------------

yearly_summary = (
    df.groupby("YEAR")
    .agg(
        total_crimes=("TOTAL IPC CRIMES", "sum"),
        average_crimes=("TOTAL IPC CRIMES", "mean"),
        districts=("DISTRICT", "nunique")
    )
    .reset_index()
    .sort_values("YEAR")
)

yearly_path = os.path.join(
    RESULTS_DIR,
    "yearly_crime_trends.csv"
)

yearly_summary.to_csv(yearly_path, index=False)

# --------------------------------------------------
# 6. Crime category analysis
# --------------------------------------------------

excluded_columns = {
    "STATE/UT",
    "DISTRICT",
    "YEAR",
    "TOTAL IPC CRIMES"
}

crime_columns = [
    col for col in df.columns
    if col not in excluded_columns
]

category_summary = []

for column in crime_columns:
    category_summary.append({
        "crime_category": column,
        "total_cases": df[column].sum(),
        "average_cases": df[column].mean(),
        "maximum_cases": df[column].max()
    })

category_summary = pd.DataFrame(category_summary)

category_summary = category_summary.sort_values(
    "total_cases",
    ascending=False
)

category_path = os.path.join(
    RESULTS_DIR,
    "crime_category_summary.csv"
)

category_summary.to_csv(category_path, index=False)

# --------------------------------------------------
# 7. Display important results
# --------------------------------------------------

print("\n" + "=" * 60)
print("TOP 10 STATES/UTs BY TOTAL IPC CRIMES")
print("=" * 60)

print(
    state_summary.head(10).to_string(index=False)
)

print("\n" + "=" * 60)
print("TOP 10 DISTRICTS BY TOTAL IPC CRIMES")
print("=" * 60)

print(
    district_summary.head(10).to_string(index=False)
)

print("\n" + "=" * 60)
print("YEARLY CRIME TREND")
print("=" * 60)

print(
    yearly_summary.to_string(index=False)
)

print("\n" + "=" * 60)
print("TOP 10 CRIME CATEGORIES")
print("=" * 60)

print(
    category_summary.head(10).to_string(index=False)
)

# --------------------------------------------------
# 8. Save summary
# --------------------------------------------------

summary_path = os.path.join(
    RESULTS_DIR,
    "crime_context_analysis_summary.txt"
)

with open(summary_path, "w", encoding="utf-8") as f:

    f.write("NETWORKTRACE - CRIME CONTEXT ANALYSIS\n")
    f.write("=" * 60 + "\n\n")

    f.write(f"Dataset: {FILE_NAME}\n")
    f.write(f"Rows: {len(df):,}\n")
    f.write(f"Columns: {len(df.columns)}\n\n")

    f.write("Top 10 States/UTs:\n")
    f.write(state_summary.head(10).to_string(index=False))
    f.write("\n\n")

    f.write("Top 10 Districts:\n")
    f.write(district_summary.head(10).to_string(index=False))
    f.write("\n\n")

    f.write("Yearly Trends:\n")
    f.write(yearly_summary.to_string(index=False))
    f.write("\n\n")

    f.write("Top Crime Categories:\n")
    f.write(category_summary.head(10).to_string(index=False))

print("\n" + "=" * 60)
print("FILES SAVED")
print("=" * 60)

print(state_path)
print(district_path)
print(yearly_path)
print(category_path)
print(summary_path)

print("\nPhase 9.1 completed successfully.")
