'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Network,
  Filter,
  Users2,
  GitBranch,
  Route,
  Search,
  Sparkles,
  Info,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { CytoscapeGraph } from '@/components/network/CytoscapeGraph';
import { NodeInspectorDrawer } from '@/components/network/NodeInspectorDrawer';
import { CommandSearchModal } from '@/components/layout/CommandSearchModal';
import { DisclaimerBadge } from '@/components/layout/DisclaimerBadge';
import { api } from '@/lib/api';
import { NodeItem, EdgeItem, ShortestPathResponse } from '@/lib/types';
import { COMMUNITY_COLORS } from '@/lib/constants';

function ExplorerContent() {
  const searchParams = useSearchParams();
  const initialNode = searchParams.get('node');

  const [nodes, setNodes] = useState<NodeItem[]>([]);
  const [edges, setEdges] = useState<EdgeItem[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialNode);
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null);
  const [bridgeOnly, setBridgeOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Shortest Path state
  const [sourceNode, setSourceNode] = useState<string>('');
  const [targetNode, setTargetNode] = useState<string>('');
  const [pathResult, setPathResult] = useState<ShortestPathResponse | null>(null);
  const [pathLoading, setPathLoading] = useState<boolean>(false);

  useEffect(() => {
    loadGraphData();
  }, [selectedCommunity]);

  async function loadGraphData() {
    setLoading(true);
    try {
      const res = await api.getGraphView({
        community_id: selectedCommunity !== null ? selectedCommunity : undefined,
        max_nodes: 350,
        max_edges: 1200,
      });
      setNodes(res.nodes);
      setEdges(res.edges);
    } catch (err) {
      console.error('Failed to load graph view:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleFindShortestPath() {
    if (!sourceNode.trim() || !targetNode.trim()) return;
    setPathLoading(true);
    try {
      const res = await api.getShortestPath(sourceNode.trim(), targetNode.trim());
      setPathResult(res);
      if (res.found && res.nodes.length > 0) {
        // Merge path nodes into view if missing
        const existingNodeIds = new Set(nodes.map((n) => n.node_id));
        const newNodes = res.nodes.filter((n) => !existingNodeIds.has(n.node_id));
        if (newNodes.length > 0) {
          setNodes((prev) => [...prev, ...newNodes]);
        }
        setEdges((prev) => [...prev, ...res.edges]);
      }
    } catch (err) {
      console.error('Shortest path error:', err);
    } finally {
      setPathLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen">
      <Topbar
        onSearchClick={() => setIsSearchOpen(true)}
        title="Interactive Network Explorer"
        subtitle="Force-directed WebGL topology canvas with Louvain cluster isolation and bridge analysis"
      />

      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectNode={(nodeId) => setSelectedNodeId(nodeId)}
      />

      <main className="flex-1 p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Controls and Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          {/* Community Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-mono text-slate-500 uppercase mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              Community:
            </span>
            <button
              onClick={() => setSelectedCommunity(null)}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                selectedCommunity === null
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-semibold'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-400 border border-slate-700/60'
              }`}
            >
              All (8 Clusters)
            </button>

            {Array.from({ length: 8 }).map((_, cid) => {
              const colorInfo = COMMUNITY_COLORS[cid];
              const isSelected = selectedCommunity === cid;
              return (
                <button
                  key={cid}
                  onClick={() => setSelectedCommunity(isSelected ? null : cid)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-800 border font-bold text-white shadow-sm'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                  style={{ borderColor: isSelected ? colorInfo.hex : undefined }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorInfo.hex }} />
                  <span>C{cid}</span>
                </button>
              );
            })}
          </div>

          {/* Bridge Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setBridgeOnly(!bridgeOnly)}
              className={`px-3.5 py-1.5 text-xs font-mono rounded-xl border flex items-center gap-2 transition-all ${
                bridgeOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950 hover:bg-slate-850 text-slate-400 border-slate-800'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-amber-400" />
              <span>Bridge Nodes Only</span>
            </button>

            <button
              onClick={loadGraphData}
              className="p-2 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-colors"
              title="Reload Graph Canvas"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Shortest Path Tracing Tool Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[300px]">
            <Route className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">Shortest Path Analyzer:</span>
            <input
              type="text"
              placeholder="Source Node ID (e.g. 1001292...)"
              value={sourceNode}
              onChange={(e) => setSourceNode(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 flex-1"
            />
            <span className="text-slate-600 font-mono text-xs">→</span>
            <input
              type="text"
              placeholder="Target Node ID (e.g. 1183798...)"
              value={targetNode}
              onChange={(e) => setTargetNode(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 flex-1"
            />
            <button
              onClick={handleFindShortestPath}
              disabled={pathLoading || !sourceNode || !targetNode}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-mono font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              {pathLoading ? 'Tracing...' : 'Trace Path'}
            </button>
          </div>

          {pathResult && (
            <div className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              {pathResult.found ? (
                <span className="text-emerald-400">Path Found: {pathResult.length} hops ({pathResult.path.length} nodes)</span>
              ) : (
                <span className="text-rose-400">{pathResult.message || 'No connecting path found'}</span>
              )}
            </div>
          )}
        </div>

        {/* Main Cytoscape Canvas */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl">
              <div className="flex items-center gap-3 text-cyan-400 font-mono text-xs">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Computing force-directed topology & Level-Of-Detail subgraphs...</span>
              </div>
            </div>
          )}

          <CytoscapeGraph
            nodes={nodes}
            edges={edges}
            selectedNodeId={selectedNodeId}
            onNodeSelect={(nid) => setSelectedNodeId(nid)}
            highlightCommunityId={selectedCommunity}
            highlightBridgeOnly={bridgeOnly}
            height="640px"
          />

          {/* Node Inspector Drawer */}
          <NodeInspectorDrawer
            nodeId={selectedNodeId}
            onClose={() => setSelectedNodeId(null)}
            onSelectNode={(nid) => setSelectedNodeId(nid)}
          />
        </div>

        {/* Responsible Use Disclaimer */}
        <DisclaimerBadge type="gplus" compact />
      </main>
    </div>
  );
}

export default function ExplorerPage() {
  return (
    <Suspense fallback={<div className="flex-1 bg-slate-950 p-8 text-center text-xs font-mono text-slate-500">Loading Network Explorer...</div>}>
      <ExplorerContent />
    </Suspense>
  );
}
