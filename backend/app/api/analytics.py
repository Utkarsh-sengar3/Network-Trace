from fastapi import APIRouter
from typing import Dict, Any
from ..services.graph_service import graph_service

router = APIRouter(prefix="/api/analytics", tags=["Network Analytics & Evaluation"])

@router.get("/centrality-distributions")
def get_centrality_distributions():
    """Returns distributions and top nodes for degree, betweenness, closeness, PageRank."""
    return graph_service.get_centrality_distributions()
