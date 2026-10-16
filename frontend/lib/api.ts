import axios from 'axios';
import {
  NetworkSummary,
  NodeItem,
  CommunityItem,
  BridgeNodeItem,
  GraphViewResponse,
  CrimeSummary,
  YearlyTrendItem,
  StateCrimeItem,
  DistrictCrimeItem,
  CategorySummaryItem,
  SyntheticGraphResponse,
  SyntheticNetworkSummary,
  MLMetrics,
  ShortestPathResponse,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

export const api = {
  // Health
  getHealth: async () => (await client.get('/api/health')).data,

  // Network
  getNetworkSummary: async (): Promise<NetworkSummary> => (await client.get('/api/network/summary')).data,
  
  getNodes: async (params?: { community_id?: number; is_bridge?: boolean; search?: string; limit?: number; offset?: number }) =>
    (await client.get('/api/network/nodes', { params })).data,
  
  getGraphView: async (params?: { community_id?: number; max_nodes?: number; max_edges?: number }): Promise<GraphViewResponse> =>
    (await client.get('/api/network/graph-view', { params })).data,
  
  getNodeDetail: async (nodeId: string): Promise<NodeItem> =>
    (await client.get(`/api/network/node/${encodeURIComponent(nodeId)}`)).data,
  
  getNodeNeighborhood: async (nodeId: string, hops: number = 1) =>
    (await client.get(`/api/network/node/${encodeURIComponent(nodeId)}/neighborhood`, { params: { hops } })).data,
  
  getCommunities: async (): Promise<CommunityItem[]> =>
    (await client.get('/api/network/communities')).data,
  
  getCommunityDetail: async (communityId: number): Promise<CommunityItem> =>
    (await client.get(`/api/network/community/${communityId}`)).data,
  
  getBridges: async (): Promise<BridgeNodeItem[]> =>
    (await client.get('/api/network/bridges')).data,
  
  getShortestPath: async (source: string, target: string): Promise<ShortestPathResponse> =>
    (await client.post('/api/network/shortest-path', { source, target })).data,

  // Crime
  getCrimeSummary: async (): Promise<CrimeSummary> =>
    (await client.get('/api/crime/summary')).data,
  
  getYearlyTrends: async (state?: string): Promise<YearlyTrendItem[]> =>
    (await client.get('/api/crime/yearly', { params: { state } })).data,
  
  getStates: async (): Promise<StateCrimeItem[]> =>
    (await client.get('/api/crime/states')).data,
  
  getDistricts: async (params?: { state?: string; limit?: number }): Promise<DistrictCrimeItem[]> =>
    (await client.get('/api/crime/districts', { params })).data,
  
  getCategories: async (): Promise<CategorySummaryItem[]> =>
    (await client.get('/api/crime/categories')).data,

  // Synthetic
  getSyntheticNetwork: async (): Promise<{ nodes: any[]; edges: any[]; summary: SyntheticNetworkSummary }> =>
    (await client.get('/api/synthetic/network')).data,
  
  getSyntheticSummary: async (): Promise<SyntheticNetworkSummary> =>
    (await client.get('/api/synthetic/summary')).data,

  // ML
  getMLInfo: async () => (await client.get('/api/ml/info')).data,
  
  getMLMetrics: async (): Promise<MLMetrics> => (await client.get('/api/ml/metrics')).data,
  
  predictCrime: async (payload: {
    burglary: number;
    theft: number;
    robbery: number;
    riots: number;
    cheating: number;
    murder: number;
    kidnapping: number;
  }) => (await client.post('/api/ml/predict/crime', payload)).data,

  predictSyntheticRole: async (payload: { degree: number; betweenness_centrality: number }) =>
    (await client.post('/api/ml/predict/synthetic-role', payload)).data,

  // Analytics
  getCentralityDistributions: async () => (await client.get('/api/analytics/centrality-distributions')).data,
};
