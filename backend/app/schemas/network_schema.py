from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class NetworkSummary(BaseModel):
    ego_id: str
    total_nodes: int
    total_edges: int
    average_degree: float
    density: float
    connected_components: int
    largest_component_size: int
    community_count: int
    bridge_node_count: int

class NodeItem(BaseModel):
    node_id: str
    community_id: int
    degree: int
    degree_centrality: float
    betweenness_centrality: float
    closeness_centrality: float
    pagerank: float
    is_bridge: bool
    connected_communities_count: int
    connected_communities: List[int]
    color: str

class EdgeItem(BaseModel):
    source: str
    target: str
    weight: Optional[float] = 1.0
    is_cross_community: bool = False

class CommunityItem(BaseModel):
    community_id: int
    size: int
    color: str
    density: float
    internal_edges: int
    external_edges: int
    top_anchor_nodes: List[Dict[str, Any]]
    top_bridge_nodes: List[Dict[str, Any]]

class BridgeNodeItem(BaseModel):
    node_id: str
    community_id: int
    betweenness_centrality: float
    degree: int
    connected_communities_count: int
    connected_communities: List[int]
    color: str

class ShortestPathRequest(BaseModel):
    source: str
    target: str

class ShortestPathResponse(BaseModel):
    found: bool
    path: List[str] = []
    length: int = 0
    nodes: List[NodeItem] = []
    edges: List[EdgeItem] = []
    message: Optional[str] = None

class GraphViewResponse(BaseModel):
    nodes: List[NodeItem]
    edges: List[EdgeItem]
    total_graph_nodes: int
    total_graph_edges: int
    sampled: bool
