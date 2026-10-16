'use client';

import React, { useEffect, useState } from 'react';
import { X, Cpu, Network, GitBranch, ArrowRight, Share2, ExternalLink, Activity } from 'lucide-react';
import { NodeItem } from '@/lib/types';
import { api } from '@/lib/api';
import { COMMUNITY_COLORS } from '@/lib/constants';

interface NodeInspectorDrawerProps {
  nodeId: string | null;
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
}

export const NodeInspectorDrawer: React.FC<NodeInspectorDrawerProps> = ({ nodeId, onClose, onSelectNode }) => {
  const [nodeData, setNodeData] = useState<NodeItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!nodeId) {
      setNodeData(null);
      return;
    }

    setLoading(true);
    api.getNodeDetail(nodeId)
      .then((data) => setNodeData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [nodeId]);

  if (!nodeId) return null;

  const commColor = nodeData ? COMMUNITY_COLORS[nodeData.community_id]?.hex || '#06B6D4' : '#06B6D4';

  return (
    <div className="fixed top-16 right-0 bottom-0 w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-20 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: commColor }} />
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Node Intelligence</span>
          </div>
          <h3 className="text-sm font-bold font-mono text-white mt-1 break-all">
            {nodeId}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {loading && (
          <div className="py-12 text-center text-xs font-mono text-slate-500">
            Querying node topology...
          </div>
        )}

        {!loading && nodeData && (
          <>
            {/* Status & Community Banner */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Community Assigned</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Cluster {nodeData.community_id}
                </div>
              </div>

              {nodeData.is_bridge ? (
                <span className="px-2.5 py-1 text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" />
                  BRIDGE NODE
                </span>
              ) : (
                <span className="px-2.5 py-1 text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700 rounded-lg">
                  Intra-Cluster Anchor
                </span>
              )}
            </div>

            {/* Centrality Metrics Grid */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Topology & Centrality Indices
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-500">Degree (Connections)</div>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">{nodeData.degree}</div>
                  <div className="text-[10px] text-cyan-400 mt-0.5">Top percentile anchor</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-500">Betweenness</div>
                  <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                    {nodeData.betweenness_centrality.toFixed(5)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Bridge flow capacity</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-500">Closeness</div>
                  <div className="text-lg font-bold font-mono text-slate-200 mt-0.5">
                    {nodeData.closeness_centrality.toFixed(4)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Graph reachability</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-500">PageRank</div>
                  <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
                    {(nodeData.pagerank * 1000).toFixed(3)}
                    <span className="text-[10px] text-slate-500 font-normal"> ×10⁻³</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Stationary influence</div>
                </div>
              </div>
            </div>

            {/* Direct 1-Hop Neighbors Sample */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                <span>Incident Neighbors ({nodeData.neighbors_count || 0})</span>
                <span className="text-cyan-400">Click to Inspect</span>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {(nodeData.neighbors_sample || []).map((nbr) => (
                  <button
                    key={nbr.node_id}
                    onClick={() => onSelectNode(nbr.node_id)}
                    className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 flex items-center justify-between group text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: nbr.color }}
                      />
                      <span className="text-xs font-mono text-slate-300 group-hover:text-cyan-300">
                        {nbr.node_id.slice(-6)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500">
                        Deg {nbr.degree}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-[10px] font-mono text-slate-500">
        Benchmark GPlus Topological Node
      </div>
    </div>
  );
};
