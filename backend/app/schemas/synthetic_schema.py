from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class SyntheticNode(BaseModel):
    node_id: str
    node_type: str # person, organization, location
    community_id: Optional[int] = 0
    degree: int = 0
    betweenness_centrality: float = 0.0
    is_bridge: bool = False
    connected_types: List[str] = []

class SyntheticEdge(BaseModel):
    source: str
    target: str
    relationship_type: str # communication, organization, location, cross_community
    weight: float = 1.0

class SyntheticNetworkSummary(BaseModel):
    total_entities: int
    people_count: int
    organizations_count: int
    locations_count: int
    total_relationships: int
    relationship_breakdown: Dict[str, int]
    bridge_entities_count: int
    disclaimer: str

class SyntheticGraphResponse(BaseModel):
    nodes: List[SyntheticNode]
    edges: List[SyntheticEdge]
    summary: SyntheticNetworkSummary
