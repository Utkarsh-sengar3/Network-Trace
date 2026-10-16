export interface NetworkSummary {
  ego_id: string;
  total_nodes: number;
  total_edges: number;
  average_degree: number;
  density: number;
  connected_components: number;
  largest_component_size: number;
  community_count: number;
  bridge_node_count: number;
}

export interface NodeItem {
  node_id: string;
  community_id: number;
  degree: number;
  degree_centrality: number;
  betweenness_centrality: number;
  closeness_centrality: number;
  pagerank: number;
  is_bridge: boolean;
  color: string;
  connected_communities_count: number;
  connected_communities: number[];
  neighbors_count?: number;
  neighbors_sample?: Array<{
    node_id: string;
    community_id: number;
    degree: number;
    is_bridge: boolean;
    color: string;
  }>;
}

export interface EdgeItem {
  source: string;
  target: string;
  weight?: number;
  is_cross_community?: boolean;
}

export interface CommunityItem {
  community_id: number;
  size: number;
  color: string;
  density: number;
  internal_edges: number;
  external_edges: number;
  top_anchor_nodes: NodeItem[];
  top_bridge_nodes: NodeItem[];
  inter_community_connections?: Array<{
    community_1: number;
    community_2: number;
    cross_edges: number;
  }>;
}

export interface BridgeNodeItem {
  node_id: string;
  community_id: number;
  betweenness_centrality: number;
  degree: number;
  connected_communities_count: number;
  connected_communities: number[];
  color: string;
}

export interface GraphViewResponse {
  nodes: NodeItem[];
  edges: EdgeItem[];
  total_graph_nodes: number;
  total_graph_edges: number;
  sampled: boolean;
}

export interface CrimeSummary {
  total_records: number;
  total_ipc_crimes: number;
  total_states_uts: number;
  total_districts: number;
  year_range: [number, number];
  top_states_by_volume: Array<{ state: string; total_crimes: number }>;
  top_crime_categories: Array<{ category: string; total_incidents: number }>;
}

export interface YearlyTrendItem {
  year: number;
  total_crimes: number;
}

export interface StateCrimeItem {
  state: string;
  total_crimes: number;
  average_crimes: float;
  districts_count: number;
  years_count: number;
  rank: number;
}

export interface DistrictCrimeItem {
  state: string;
  district: string;
  total_crimes: number;
  average_crimes: number;
  years_count: number;
  rank: number;
}

export interface CategorySummaryItem {
  category: string;
  total_incidents: number;
  percentage: number;
}

export interface SyntheticNode {
  node_id: string;
  node_type: 'person' | 'organization' | 'location';
  community_id: number;
  degree: number;
  betweenness_centrality: number;
  is_bridge: boolean;
  connected_types: string[];
}

export interface SyntheticEdge {
  source: string;
  target: string;
  relationship_type: string;
  weight: number;
}

export interface SyntheticNetworkSummary {
  total_entities: number;
  people_count: number;
  organizations_count: number;
  locations_count: number;
  total_relationships: number;
  relationship_breakdown: Record<string, number>;
  bridge_entities_count: number;
  disclaimer: string;
}

export interface MLMetrics {
  crime_forecasting: {
    dataset_name: string;
    target_variable: string;
    train_samples: number;
    test_samples: number;
    validation_split: string;
    features: string[];
    models: Record<string, {
      r2: number;
      mae: number;
      rmse: number;
      feature_importances: Array<{ feature: string; importance: number; description: string }>;
    }>;
  };
  synthetic_classification: {
    model_name: string;
    task_type: string;
    target_variable: string;
    dataset_name: string;
    train_samples: number;
    test_samples: number;
    precision: number;
    recall: number;
    f1: number;
    confusion_matrix: number[][];
    labels: string[];
    validation_notes: string;
  };
}

export interface ShortestPathResponse {
  found: boolean;
  path: string[];
  length: number;
  nodes: NodeItem[];
  edges: EdgeItem[];
  message?: string;
}
