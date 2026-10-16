'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GitBranch, Shield, ArrowRight, Activity, Cpu, Layers, ExternalLink, HelpCircle } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { DisclaimerBadge } from '@/components/layout/DisclaimerBadge';
import { api } from '@/lib/api';
import { BridgeNodeItem } from '@/lib/types';
import { COMMUNITY_COLORS } from '@/lib/constants';

export default function BridgeAnalysisPage() {
  const [bridges, setBridges] = useState<BridgeNodeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBridges()
      .then((data) => setBridges(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen">
      <Topbar
        title="Bridge Node Vulnerability & Cross-Cluster Analysis"
        subtitle="Identifying structurally critical connectors bridging distinct graph communities"
      />

      <main className="flex-1 p-8 space-y-8 max-w-7xl w-full mx-auto">
        <DisclaimerBadge type="gplus" compact />

        {/* Bridge Intelligence Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            <GitBranch className="w-4 h-4" />
            <span>Structural Bottleneck Theory</span>
          </div>
          <p className="text-xs text-slate-300 max-w-4xl leading-relaxed">
            Bridge nodes possess disproportionately high <strong>betweenness centrality</strong>, acting as essential communication brokers across multiple distinct Louvain communities. In network defense and graph integrity analysis, removing or monitoring these bridge entities disrupts cross-cluster coordination.
          </p>
        </div>

        {/* Bridges Master Table */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-amber-400" />
                Ranked Cross-Cluster Bridge Entities ({bridges.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Sorted by betweenness centrality and multi-community reach</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500">
                  <th className="pb-3">Rank</th>
                  <th className="pb-3">Node ID</th>
                  <th className="pb-3">Home Cluster</th>
                  <th className="pb-3">Betweenness Centrality</th>
                  <th className="pb-3">Degree</th>
                  <th className="pb-3">Connected Clusters</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {bridges.slice(0, 50).map((b, idx) => (
                  <tr key={b.node_id} className="hover:bg-slate-850 transition-colors">
                    <td className="py-3 text-slate-500">#{idx + 1}</td>
                    <td className="py-3 text-white font-medium">{b.node_id}</td>
                    <td className="py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px]"
                        style={{ backgroundColor: `${b.color}20`, color: b.color }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: b.color }} />
                        Cluster {b.community_id}
                      </span>
                    </td>
                    <td className="py-3 text-amber-400 font-bold">{b.betweenness_centrality.toFixed(5)}</td>
                    <td className="py-3 text-slate-300">{b.degree}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        {b.connected_communities.map((cid) => (
                          <span
                            key={cid}
                            className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-slate-950"
                            style={{ backgroundColor: COMMUNITY_COLORS[cid]?.hex || '#06B6D4' }}
                            title={`Cluster ${cid}`}
                          >
                            {cid}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/node-intelligence?node=${encodeURIComponent(b.node_id)}`}
                        className="px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-cyan-400 hover:text-cyan-300 rounded-lg text-[11px] font-sans transition-colors inline-flex items-center gap-1"
                      >
                        <span>Profile</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
