'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Cpu, Search, Filter, ArrowRight, GitBranch, Shield, Activity, RefreshCw } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { DisclaimerBadge } from '@/components/layout/DisclaimerBadge';
import { CytoscapeGraph } from '@/components/network/CytoscapeGraph';
import { api } from '@/lib/api';
import { NodeItem } from '@/lib/types';
import { COMMUNITY_COLORS } from '@/lib/constants';

function NodeIntelligenceContent() {
  const searchParams = useSearchParams();
  const urlNodeId = searchParams.get('node');

  const [nodes, setNodes] = useState<NodeItem[]>([]);
  const [selectedNode, setSelectedNode] = useState<NodeItem | null>(null);
  const [egoSubGraph, setEgoSubGraph] = useState<{ nodes: NodeItem[]; edges: any[] }>({ nodes: [], edges: [] });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedComm, setSelectedComm] = useState<number | null>(null);
  const [bridgeFilter, setBridgeFilter] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    loadNodesList();
  }, [selectedComm, bridgeFilter]);

  async function loadNodesList() {
    setLoading(true);
    try {
      const res = await api.getNodes({
        community_id: selectedComm !== null ? selectedComm : undefined,
        is_bridge: bridgeFilter !== null ? bridgeFilter : undefined,
        search: searchQuery ? searchQuery : undefined,
        limit: 50,
      });
      setNodes(res.nodes || []);

      if (urlNodeId) {
        handleSelectNode(urlNodeId);
      } else if (res.nodes && res.nodes.length > 0 && !selectedNode) {
        handleSelectNode(res.nodes[0].node_id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectNode(nodeId: string) {
    setSubLoading(true);
    try {
      const [detail, nbrs] = await Promise.all([
        api.getNodeDetail(nodeId),
        api.getNodeNeighborhood(nodeId, 1),
      ]);
      setSelectedNode(detail);
      setEgoSubGraph({ nodes: nbrs.nodes, edges: nbrs.edges });
    } catch (err) {
      console.error(err);
    } finally {
      setSubLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen">
      <Topbar
        title="Node Intelligence Directory"
        subtitle="Individual topological profiles, centrality rankings, and 1-hop ego subgraphs"
      />

      <main className="flex-1 p-8 space-y-6 max-w-7xl w-full mx-auto">
        <DisclaimerBadge type="gplus" compact />

        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Search & Node Directory Table (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col h-[780px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Topological Node Directory
                </h3>
                <span className="text-xs font-mono text-slate-500">{nodes.length} nodes loaded</span>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter node ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadNodesList()}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <button
                  onClick={() => { setSelectedComm(null); setBridgeFilter(null); }}
                  className={`px-2.5 py-1 rounded-lg font-mono ${
                    selectedComm === null && bridgeFilter === null
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setBridgeFilter(bridgeFilter === true ? null : true)}
                  className={`px-2.5 py-1 rounded-lg font-mono ${
                    bridgeFilter === true
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Bridges Only
                </button>
              </div>
            </div>

            {/* Scrollable Node Table */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {nodes.map((n) => {
                const isSelected = selectedNode?.node_id === n.node_id;
                const colorInfo = COMMUNITY_COLORS[n.community_id] || { hex: '#06B6D4' };

                return (
                  <button
                    key={n.node_id}
                    onClick={() => handleSelectNode(n.node_id)}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all text-left group ${
                      isSelected
                        ? 'bg-slate-850 border-cyan-500/50 shadow-md'
                        : 'bg-slate-950/80 hover:bg-slate-850 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorInfo.hex }} />
                      <div>
                        <div className="text-xs font-mono font-medium text-white group-hover:text-cyan-300">
                          {n.node_id.slice(-8)}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Comm {n.community_id} • Deg: {n.degree}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono text-amber-400 font-semibold">
                        {n.betweenness_centrality.toFixed(4)}
                      </div>
                      <div className="text-[10px] text-slate-600">Betweenness</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Node Intelligence Profile & Ego Subgraph (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {selectedNode ? (
              <>
                {/* Node Detail Card */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COMMUNITY_COLORS[selectedNode.community_id]?.hex || '#06B6D4' }}
                        />
                        <span className="text-xs font-mono text-cyan-400 font-semibold">
                          CLUSTER {selectedNode.community_id} PARTICIPANT
                        </span>
                      </div>
                      <h2 className="text-lg font-bold font-mono text-white mt-1">
                        Node ID: {selectedNode.node_id}
                      </h2>
                    </div>

                    {selectedNode.is_bridge ? (
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
                        <GitBranch className="w-4 h-4" />
                        CROSS-CLUSTER BRIDGE
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-mono">
                        INTRA-CLUSTER ANCHOR
                      </span>
                    )}
                  </div>

                  {/* 4 Centrality Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">Degree</div>
                      <div className="text-xl font-bold font-mono text-white mt-0.5">{selectedNode.degree}</div>
                      <div className="text-[10px] text-slate-400">Direct connections</div>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">Betweenness</div>
                      <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                        {selectedNode.betweenness_centrality.toFixed(5)}
                      </div>
                      <div className="text-[10px] text-slate-400">Bottleneck score</div>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">Closeness</div>
                      <div className="text-xl font-bold font-mono text-slate-200 mt-0.5">
                        {selectedNode.closeness_centrality.toFixed(4)}
                      </div>
                      <div className="text-[10px] text-slate-400">Mean shortest dist</div>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">PageRank</div>
                      <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                        {(selectedNode.pagerank * 1000).toFixed(3)}
                        <span className="text-[10px] text-slate-500"> ×10⁻³</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Markov weight</div>
                    </div>
                  </div>
                </div>

                {/* 1-Hop Ego Subgraph Canvas */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        1-Hop Ego Subgraph Visualization
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Direct topological neighborhood for Node {selectedNode.node_id.slice(-6)}</p>
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      {egoSubGraph.nodes.length} Neighbors • {egoSubGraph.edges.length} Edges
                    </span>
                  </div>

                  <CytoscapeGraph
                    nodes={egoSubGraph.nodes}
                    edges={egoSubGraph.edges}
                    selectedNodeId={selectedNode.node_id}
                    onNodeSelect={(nid) => nid && handleSelectNode(nid)}
                    height="400px"
                  />
                </div>
              </>
            ) : (
              <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono text-xs text-slate-500">
                Select a node from the directory to inspect its profile.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function NodeIntelligencePage() {
  return (
    <Suspense fallback={<div className="flex-1 bg-slate-950 p-8 text-center text-xs font-mono text-slate-500">Loading Node Intelligence...</div>}>
      <NodeIntelligenceContent />
    </Suspense>
  );
}
