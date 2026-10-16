'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert, Users, Building2, MapPin, GitBranch, RefreshCw, Filter, ShieldCheck } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { DisclaimerBadge } from '@/components/layout/DisclaimerBadge';
import { CytoscapeGraph } from '@/components/network/CytoscapeGraph';
import { api } from '@/lib/api';
import { SyntheticNetworkSummary } from '@/lib/types';

export default function SyntheticNetworkPage() {
  const [networkData, setNetworkData] = useState<{ nodes: any[]; edges: any[]; summary: SyntheticNetworkSummary | null }>({
    nodes: [],
    edges: [],
    summary: null,
  });
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSyntheticNetwork()
      .then((data) => {
        setNetworkData(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredNodes = selectedType
    ? networkData.nodes.filter((n) => n.node_type === selectedType)
    : networkData.nodes;

  // Format synthetic nodes for Cytoscape renderer
  const cyFormattedNodes = filteredNodes.map((n) => {
    let color = '#10B981'; // person = emerald
    if (n.node_type === 'organization') color = '#6366F1'; // indigo
    if (n.node_type === 'location') color = '#F43F5E'; // rose
    if (n.is_bridge) color = '#FCD34D'; // gold for synthetic bridge

    return {
      node_id: n.node_id,
      community_id: n.community_id || 0,
      degree: n.degree || 0,
      degree_centrality: 0,
      betweenness_centrality: n.betweenness_centrality || 0,
      closeness_centrality: 0,
      pagerank: 0,
      is_bridge: n.is_bridge,
      color,
      connected_communities_count: 1,
      connected_communities: [n.community_id || 0],
    };
  });

  const cyFormattedEdges = networkData.edges.map((e) => ({
    source: e.source,
    target: e.target,
    weight: e.weight || 1.0,
    is_cross_community: e.relationship_type === 'cross_community',
  }));

  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen">
      <Topbar
        title="Synthetic Criminal Network Demonstration"
        subtitle="Multi-relational simulation model evaluating cross-community links and organizational roles"
      />

      <main className="flex-1 p-8 space-y-6 max-w-7xl w-full mx-auto">
        <DisclaimerBadge type="synthetic" />

        {/* Entity Breakdown Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">People Entities</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                {networkData.summary?.people_count || 60} Person Nodes
              </div>
            </div>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Organizations</div>
              <div className="text-xl font-bold font-mono text-indigo-400 mt-0.5">
                {networkData.summary?.organizations_count || 3} Groups
              </div>
            </div>
            <Building2 className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Locations</div>
              <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">
                {networkData.summary?.locations_count || 4} Geo Sites
              </div>
            </div>
            <MapPin className="w-5 h-5 text-rose-400" />
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Synthetic Bridges</div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                {networkData.summary?.bridge_entities_count || 4} Connectors
              </div>
            </div>
            <GitBranch className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 uppercase mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              Filter Entity Type:
            </span>
            <button
              onClick={() => setSelectedType(null)}
              className={`px-3 py-1 rounded-lg text-xs font-mono ${
                selectedType === null
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              All (67 Entities)
            </button>
            <button
              onClick={() => setSelectedType('person')}
              className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 ${
                selectedType === 'person'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              People (P001-P060)
            </button>
            <button
              onClick={() => setSelectedType('organization')}
              className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 ${
                selectedType === 'organization'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              Organizations (ORG_A/B/C)
            </button>
            <button
              onClick={() => setSelectedType('location')}
              className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 ${
                selectedType === 'location'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              Locations
            </button>
          </div>
        </div>

        {/* Interactive Synthetic Graph Canvas */}
        <CytoscapeGraph
          nodes={cyFormattedNodes}
          edges={cyFormattedEdges}
          height="560px"
        />
      </main>
    </div>
  );
}
