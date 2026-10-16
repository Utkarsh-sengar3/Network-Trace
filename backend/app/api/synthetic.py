from fastapi import APIRouter
from typing import Dict, Any
from ..services.synthetic_service import synthetic_service
from ..schemas.synthetic_schema import (
    SyntheticGraphResponse,
    SyntheticNetworkSummary
)

router = APIRouter(prefix="/api/synthetic", tags=["Synthetic Criminal Network"])

@router.get("/network", response_model=SyntheticGraphResponse)
def get_synthetic_network():
    """Returns complete multi-relational synthetic network (People, Orgs, Locations)."""
    return synthetic_service.get_network()

@router.get("/summary", response_model=SyntheticNetworkSummary)
def get_synthetic_summary():
    """Returns synthetic network entity breakdowns and disclaimer."""
    return synthetic_service.get_summary()
