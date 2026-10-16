from fastapi import APIRouter, Query
from typing import Optional, List, Dict, Any
from ..services.crime_service import crime_service
from ..schemas.crime_schema import (
    CrimeSummary,
    YearlyTrendItem,
    StateCrimeItem,
    DistrictCrimeItem,
    CategorySummaryItem
)

router = APIRouter(prefix="/api/crime", tags=["Crime in India Context"])

@router.get("/summary", response_model=CrimeSummary)
def get_crime_summary():
    """Top-level statistical overview of Crime in India (2001-2012) dataset."""
    return crime_service.get_summary()

@router.get("/yearly")
def get_yearly_trends(state: Optional[str] = Query(None, description="Filter trends by State/UT")):
    """Yearly total crime volume from 2001 to 2012."""
    return crime_service.get_yearly_trends(state)

@router.get("/states", response_model=List[StateCrimeItem])
def get_states():
    """State-wise total crimes, district counts, and rankings."""
    return crime_service.get_states()

@router.get("/districts", response_model=List[DistrictCrimeItem])
def get_districts(
    state: Optional[str] = Query(None, description="Filter districts by State/UT"),
    limit: int = Query(100, ge=1, le=1000)
):
    """District-wise crime counts and averages, excluding aggregated totals."""
    return crime_service.get_districts(state, limit)

@router.get("/categories", response_model=List[CategorySummaryItem])
def get_categories():
    """Breakdown of IPC crime categories and percentage distributions."""
    return crime_service.get_categories()
