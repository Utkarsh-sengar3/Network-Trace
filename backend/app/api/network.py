from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from ..services.graph_service import graph_service
from ..schemas.network_schema import (
    NetworkSummary,
    NodeItem,
    CommunityItem,
    BridgeNodeItem,
    ShortestPathRequest,
    ShortestPathResponse,
    GraphViewResponse
)

router = APIRouter(prefix="/api/network", tags=["Network & Graph Analytics"])

@router.get("/summary", response_model=NetworkSummary)
def get_network_summary():
    """Returns top-level structural metrics for the GPlus benchmark graph."""
    return graph_service.get_summary()

@router.get("/nodes")
def get_nodes(
    community_id: Optional[int] = Query(None, description="Filter by Louvain community (0-7)"),
    is_bridge: Optional[bool] = Query(None, description="Filter only bridge nodes"),
    search: Optional[str] = Query(None, description="Search node ID substring"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0)
):
    """Returns paginated node directory with centralities and community memberships."""
    return graph_service.get_nodes(community_id, is_bridge, search, limit, offset)

@router.get("/graph-view", response_model=GraphViewResponse)
def get_graph_view(
    community_id: Optional[int] = Query(None, description="Isolate single community"),
    max_nodes: int = Query(350, ge=50, le=1650),
    max_edges: int = Query(1200, ge=100, le=5000)
):
    """
    Returns level-of-detail optimized subgraph payload for Cytoscape.js rendering.
    Prioritizes bridge nodes, key anchors, and cross-community links.
    """
    return graph_service.get_graph_view(community_id, max_nodes, max_edges)

@router.get("/node/{node_id}")
def get_node_detail(node_id: str):
    """Detailed intelligence profile for a specific node."""
    detail = graph_service.get_node_detail(node_id)
    if not detail:
        raise HTTPException(status_code=404, detail=f"Node '{node_id}' not found.")
    return detail

@router.get("/node/{node_id}/neighborhood")
def get_node_neighborhood(
    node_id: str,
    hops: int = Query(1, ge=1, le=2),
    max_nodes: int = Query(100, ge=10, le=250)
):
    """Returns exact 1-hop or 2-hop ego subgraph for a selected node."""
    if node_id not in graph_service.node_lookup:
        raise HTTPException(status_code=404, detail=f"Node '{node_id}' not found.")
    return graph_service.get_neighborhood(node_id, hops, max_nodes)

@router.get("/communities", response_model=List[CommunityItem])
def get_communities():
    """Returns all 8 Louvain communities with sizes, internal/external densities, and anchors."""
    return graph_service.get_communities()

@router.get("/community/{community_id}")
def get_community_detail(community_id: int):
    """Deep-dive profile for a specific Louvain community."""
    comm = graph_service.get_community_detail(community_id)
    if not comm:
        raise HTTPException(status_code=404, detail=f"Community {community_id} not found.")
    return comm

@router.get("/bridges", response_model=List[BridgeNodeItem])
def get_bridges():
    """Returns high-betweenness bridge entities connecting multiple communities."""
    return graph_service.get_bridges()

@router.post("/shortest-path", response_model=ShortestPathResponse)
def get_shortest_path(payload: ShortestPathRequest):
    """Calculates shortest path between two nodes in the graph."""
    return graph_service.get_shortest_path(payload.source, payload.target)
