'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users2, ArrowRight, GitBranch, Anchor, Network, ExternalLink, ShieldCheck } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { DisclaimerBadge } from '@/components/layout/DisclaimerBadge';
import { CommandSearchModal } from '@/components/layout/CommandSearchModal';
import { api } from '@/lib/api';
import { CommunityItem } from '@/lib/types';
import { COMMUNITY_COLORS } from '@/lib/constants';

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<CommunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    api.getCommunities()
      .then((data) => setCommunities(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen">
      <Topbar
        onSearchClick={() => setIsSearchOpen(true)}
        title="Community Explorer"
        subtitle="Louvain Modularity Partitioning (8 Communities, Modularity Q = 0.584)"
      />

      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <main className="flex-1 p-8 space-y-8 max-w-7xl w-full mx-auto">
        <DisclaimerBadge type="gplus" compact />

        {/* Community Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {communities.map((comm) => {
            const colorInfo = COMMUNITY_COLORS[comm.community_id] || { hex: '#06B6D4', name: 'Cluster' };

            return (
              <div
                key={comm.community_id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl flex flex-col justify-between space-y-5 group relative overflow-hidden transition-all hover:scale-[1.01]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5"
                      style={{ backgroundColor: `${colorInfo.hex}20`, color: colorInfo.hex }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorInfo.hex }} />
                      Cluster {comm.community_id}
                    </span>

                    <span className="text-xs font-mono text-slate-500">
                      Density: {(comm.density * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div>
                    <div className="text-2xl font-bold font-mono text-white">
                      {comm.size.toLocaleString()}
                      <span className="text-xs font-sans text-slate-400 font-normal ml-1.5">nodes</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {comm.internal_edges.toLocaleString()} internal edges • {comm.external_edges.toLocaleString()} cross-links
                    </div>
                  </div>

                  {/* Top Anchors & Top Bridges List */}
                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1 mb-1.5">
                        <Anchor className="w-3 h-3 text-cyan-400" />
                        Key Intra-Cluster Anchors
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {comm.top_anchor_nodes.slice(0, 3).map((a) => (
                          <Link
                            key={a.node_id}
                            href={`/node-intelligence?node=${encodeURIComponent(a.node_id)}`}
                            className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition-colors"
                          >
                            {a.node_id.slice(-5)} (d:{a.degree})
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1 mb-1.5">
                        <GitBranch className="w-3 h-3 text-amber-400" />
                        Top Bridge Nodes
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {comm.top_bridge_nodes.slice(0, 3).map((b) => (
                          <Link
                            key={b.node_id}
                            href={`/node-intelligence?node=${encodeURIComponent(b.node_id)}`}
                            className="px-2 py-0.5 bg-amber-950/20 hover:bg-amber-900/30 border border-amber-800/40 rounded text-[11px] font-mono text-amber-300 hover:text-amber-200 transition-colors"
                          >
                            {b.node_id.slice(-5)} (b:{b.betweenness_centrality.toFixed(3)})
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/explorer`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-mono font-semibold text-slate-300 hover:text-white flex items-center justify-between transition-colors mt-4"
                >
                  <span>Isolate Cluster {comm.community_id}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
