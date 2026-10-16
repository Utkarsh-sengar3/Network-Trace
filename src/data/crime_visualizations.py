import os
import pandas as pd
import matplotlib.pyplot as plt


# ============================================================
# NETWORKTRACE - CRIME CONTEXT VISUALIZATIONS
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

RESULTS_DIR = os.path.join(
    BASE_DIR,
    "results",
    "crime_context"
)

OUTPUT_DIR = os.path.join(
    RESULTS_DIR,
    "visualizations"
)

os.makedirs(OUTPUT_DIR, exist_ok=True)


print("=" * 60)
print("NETWORKTRACE - CRIME CONTEXT VISUALIZATIONS")
print("=" * 60)


# ============================================================
# 1. LOAD PROCESSED RESULTS
# ============================================================

state_file = os.path.join(
    RESULTS_DIR,
    "state_crime_summary.csv"
)

district_file = os.path.join(
    RESULTS_DIR,
    "district_crime_summary.csv"
)

yearly_file = os.path.join(
    RESULTS_DIR,
    "yearly_crime_trends.csv"
)

category_file = os.path.join(
    RESULTS_DIR,
    "crime_category_summary.csv"
)


state_df = pd.read_csv(state_file)
district_df = pd.read_csv(district_file)
yearly_df = pd.read_csv(yearly_file)
category_df = pd.read_csv(category_file)


print("\nData loaded successfully.")


# ============================================================
# 2. YEARLY CRIME TREND
# ============================================================

plt.figure(figsize=(10, 6))

plt.plot(
    yearly_df["YEAR"],
    yearly_df["total_crimes"],
    marker="o"
)

plt.title("Total IPC Crimes by Year")
plt.xlabel("Year")
plt.ylabel("Total IPC Crimes")
plt.grid(True, alpha=0.3)

plt.tight_layout()

yearly_path = os.path.join(
    OUTPUT_DIR,
    "yearly_crime_trend.png"
)

plt.savefig(
    yearly_path,
    dpi=300,
    bbox_inches="tight"
)

plt.close()

print("Saved:", yearly_path)


# ============================================================
# 3. TOP 10 STATES
# ============================================================

top_states = state_df.head(10).sort_values(
    "total_crimes"
)

plt.figure(figsize=(10, 6))

plt.barh(
    top_states["STATE/UT"],
    top_states["total_crimes"]
)

plt.title("Top 10 States/UTs by Total IPC Crimes")
plt.xlabel("Total IPC Crimes")
plt.ylabel("State/UT")

plt.tight_layout()

states_path = os.path.join(
    OUTPUT_DIR,
    "top_10_states.png"
)

plt.savefig(
    states_path,
    dpi=300,
    bbox_inches="tight"
)

plt.close()

print("Saved:", states_path)


# ============================================================
# 4. TOP 10 ACTUAL DISTRICTS
# ============================================================

# Remove aggregate TOTAL rows
district_df = district_df[
    district_df["DISTRICT"].str.upper() != "TOTAL"
]

top_districts = district_df.head(10).sort_values(
    "total_crimes"
)

# Combine district + state for readable labels
top_districts["location"] = (
    top_districts["DISTRICT"]
    + " ("
    + top_districts["STATE/UT"]
    + ")"
)

plt.figure(figsize=(11, 7))

plt.barh(
    top_districts["location"],
    top_districts["total_crimes"]
)

plt.title("Top 10 Districts by Total IPC Crimes")
plt.xlabel("Total IPC Crimes")
plt.ylabel("District")

plt.tight_layout()

district_path = os.path.join(
    OUTPUT_DIR,
    "top_10_districts.png"
)

plt.savefig(
    district_path,
    dpi=300,
    bbox_inches="tight"
)

plt.close()

print("Saved:", district_path)


# ============================================================
# 5. TOP 10 CRIME CATEGORIES
# ============================================================

top_categories = category_df.head(10).sort_values(
    "total_cases"
)

plt.figure(figsize=(11, 7))

plt.barh(
    top_categories["crime_category"],
    top_categories["total_cases"]
)

plt.title("Top 10 Crime Categories")
plt.xlabel("Total Cases")
plt.ylabel("Crime Category")

plt.tight_layout()

category_path = os.path.join(
    OUTPUT_DIR,
    "top_10_crime_categories.png"
)

plt.savefig(
    category_path,
    dpi=300,
    bbox_inches="tight"
)

plt.close()

print("Saved:", category_path)


# ============================================================
# 6. SUMMARY
# ============================================================

summary_file = os.path.join(
    OUTPUT_DIR,
    "visualization_summary.txt"
)

with open(summary_file, "w", encoding="utf-8") as f:

    f.write("NETWORKTRACE - CRIME CONTEXT VISUALIZATIONS\n")
    f.write("=" * 60 + "\n\n")

    f.write("Generated visualizations:\n\n")

    f.write("1. yearly_crime_trend.png\n")
    f.write("2. top_10_states.png\n")
    f.write("3. top_10_districts.png\n")
    f.write("4. top_10_crime_categories.png\n")

print("\n" + "=" * 60)
print("VISUALIZATION PHASE COMPLETED")
print("=" * 60)

print("\nOutput directory:")
print(OUTPUT_DIR)

print("\nGenerated files:")
print("- yearly_crime_trend.png")
print("- top_10_states.png")
print("- top_10_districts.png")
print("- top_10_crime_categories.png")

print("\nPhase 9.2 completed successfully.")