import pandas as pd
from typing import List, Dict, Any, Optional
from pathlib import Path
from ..config import CRIME_RESULTS_DIR, CRIME_DATA_DIR

class CrimeService:
    def __init__(self):
        self._initialized = False
        self.state_summary_df: pd.DataFrame = pd.DataFrame()
        self.district_summary_df: pd.DataFrame = pd.DataFrame()
        self.yearly_trends_df: pd.DataFrame = pd.DataFrame()
        self.category_summary_df: pd.DataFrame = pd.DataFrame()
        self.raw_crime_df: pd.DataFrame = pd.DataFrame()

    def load_data(self):
        if self._initialized:
            return

        print("Initializing CrimeService & loading Crime in India context data...")
        
        state_file = CRIME_RESULTS_DIR / "state_crime_summary.csv"
        if state_file.exists():
            self.state_summary_df = pd.read_csv(state_file)
            self.state_summary_df["STATE/UT"] = self.state_summary_df["STATE/UT"].astype(str).str.strip()

        dist_file = CRIME_RESULTS_DIR / "district_crime_summary.csv"
        if dist_file.exists():
            self.district_summary_df = pd.read_csv(dist_file)
            self.district_summary_df["STATE/UT"] = self.district_summary_df["STATE/UT"].astype(str).str.strip()
            self.district_summary_df["DISTRICT"] = self.district_summary_df["DISTRICT"].astype(str).str.strip()
            # Exclude TOTAL rows
            self.district_summary_df = self.district_summary_df[
                self.district_summary_df["DISTRICT"].str.upper() != "TOTAL"
            ].copy()

        yearly_file = CRIME_RESULTS_DIR / "yearly_crime_trends.csv"
        if yearly_file.exists():
            self.yearly_trends_df = pd.read_csv(yearly_file)

        cat_file = CRIME_RESULTS_DIR / "crime_category_summary.csv"
        if cat_file.exists():
            self.category_summary_df = pd.read_csv(cat_file)

        # Raw file for granular queries if needed
        raw_file = CRIME_DATA_DIR / "01_District_wise_crimes_committed_IPC_2001_2012.csv"
        if raw_file.exists():
            self.raw_crime_df = pd.read_csv(raw_file)
            self.raw_crime_df.columns = self.raw_crime_df.columns.str.strip()
            self.raw_crime_df["STATE/UT"] = self.raw_crime_df["STATE/UT"].astype(str).str.strip()
            self.raw_crime_df["DISTRICT"] = self.raw_crime_df["DISTRICT"].astype(str).str.strip()
            self.raw_crime_df = self.raw_crime_df[self.raw_crime_df["DISTRICT"].str.upper() != "TOTAL"].copy()

        self._initialized = True

    def get_summary(self) -> Dict[str, Any]:
        self.load_data()
        total_crimes = int(self.state_summary_df["total_crimes"].sum()) if not self.state_summary_df.empty else 0
        total_states = len(self.state_summary_df) if not self.state_summary_df.empty else 0
        total_districts = len(self.district_summary_df) if not self.district_summary_df.empty else 0
        years = sorted(self.yearly_trends_df["YEAR"].unique().tolist()) if not self.yearly_trends_df.empty else [2001, 2012]

        top_states = []
        if not self.state_summary_df.empty:
            top_states = self.state_summary_df.head(10).rename(
                columns={"STATE/UT": "state", "total_crimes": "total_crimes"}
            ).to_dict(orient="records")

        top_cats = []
        if not self.category_summary_df.empty:
            df_c = self.category_summary_df.copy()
            cat_col = "crime_category" if "crime_category" in df_c.columns else "CRIME_CATEGORY"
            tot_col = "total_cases" if "total_cases" in df_c.columns else "TOTAL_INCIDENTS"
            for _, row in df_c.head(10).iterrows():
                top_cats.append({
                    "category": str(row[cat_col]),
                    "total_incidents": int(row[tot_col]),
                    "percentage": round(float(row[tot_col]) / max(total_crimes, 1) * 100, 2)
                })

        return {
            "total_records": len(self.raw_crime_df) if not self.raw_crime_df.empty else 9017,
            "total_ipc_crimes": total_crimes,
            "total_states_uts": total_states,
            "total_districts": total_districts,
            "year_range": [min(years), max(years)] if years else [2001, 2012],
            "top_states_by_volume": top_states,
            "top_crime_categories": top_cats
        }

    def get_yearly_trends(self, state: Optional[str] = None) -> List[Dict[str, Any]]:
        self.load_data()
        if state and not self.raw_crime_df.empty:
            filtered = self.raw_crime_df[self.raw_crime_df["STATE/UT"].str.upper() == state.upper()]
            if not filtered.empty:
                yearly = filtered.groupby("YEAR")["TOTAL IPC CRIMES"].sum().reset_index()
                return yearly.rename(columns={"YEAR": "year", "TOTAL IPC CRIMES": "total_crimes"}).to_dict(orient="records")
        
        if not self.yearly_trends_df.empty:
            return self.yearly_trends_df.rename(
                columns={"YEAR": "year", "TOTAL_IPC_CRIMES": "total_crimes"}
            ).to_dict(orient="records")
        return []

    def get_states(self) -> List[Dict[str, Any]]:
        self.load_data()
        if self.state_summary_df.empty:
            return []
        
        records = self.state_summary_df.to_dict(orient="records")
        for rank, r in enumerate(records, start=1):
            r["rank"] = rank
            r["state"] = r["STATE/UT"]
            r["districts_count"] = int(r.get("districts", 1))
            r["years_count"] = int(r.get("years", 12))
        return records

    def get_districts(self, state: Optional[str] = None, limit: int = 100) -> List[Dict[str, Any]]:
        self.load_data()
        df = self.district_summary_df
        if state:
            df = df[df["STATE/UT"].str.upper() == state.upper()]
        
        records = df.head(limit).to_dict(orient="records")
        for rank, r in enumerate(records, start=1):
            r["rank"] = rank
            r["state"] = r["STATE/UT"]
            r["district"] = r["DISTRICT"]
            r["years_count"] = int(r.get("years", 12))
        return records

    def get_categories(self) -> List[Dict[str, Any]]:
        self.load_data()
        if self.category_summary_df.empty:
            return []
        
        df_c = self.category_summary_df.copy()
        cat_col = "crime_category" if "crime_category" in df_c.columns else "CRIME_CATEGORY"
        tot_col = "total_cases" if "total_cases" in df_c.columns else "TOTAL_INCIDENTS"
        total_sum = float(df_c[tot_col].sum())
        
        results = []
        for _, row in df_c.iterrows():
            cnt = int(row[tot_col])
            pct = round((cnt / total_sum) * 100, 2) if total_sum > 0 else 0.0
            results.append({
                "category": str(row[cat_col]),
                "total_incidents": cnt,
                "percentage": pct
            })
        return results

crime_service = CrimeService()
