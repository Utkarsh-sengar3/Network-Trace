from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class CrimeSummary(BaseModel):
    total_records: int
    total_ipc_crimes: int
    total_states_uts: int
    total_districts: int
    year_range: List[int]
    top_states_by_volume: List[Dict[str, Any]]
    top_crime_categories: List[Dict[str, Any]]

class YearlyTrendItem(BaseModel):
    year: int
    total_crimes: int
    categories: Dict[str, int]

class StateCrimeItem(BaseModel):
    state: str
    total_crimes: int
    average_crimes: float
    districts_count: int
    years_count: int
    rank: int

class DistrictCrimeItem(BaseModel):
    state: str
    district: str
    total_crimes: int
    average_crimes: float
    years_count: int
    rank: int

class CategorySummaryItem(BaseModel):
    category: str
    total_incidents: int
    percentage: float
