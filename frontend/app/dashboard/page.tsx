'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Network,
  Users2,
  GitBranch,
  BarChart3,
  Activity,
  Layers,
  ArrowRight,
  TrendingUp,
  Shield,
  Cpu,
} from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { MetricCard } from '@/components/analytics/MetricCard';
import { DisclaimerBadge } from '@/components/layout/DisclaimerBadge';
import { CommandSearchModal } from '@/components/layout/CommandSearchModal';
import { api } from '@/lib/api';
import { NetworkSummary, CrimeSummary, CommunityItem, BridgeNodeItem, YearlyTrendItem } from '@/lib/types';
import { COMMUNITY_COLORS } from '@/lib/constants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
} from 'recharts';

export default function DashboardPage() {
  const [netSummary, setNetSummary] = useState<NetworkSummary | null>(null);
  const [crimeSummary, setCrimeSummary] = useState<CrimeSummary | null>(null);
  const [communities, setCommunities] = useState<CommunityItem[]>([]);
  const [bridges, setBridges] = useState<BridgeNodeItem[]>([]);
  const [yearlyTrends, setYearlyTrends] = useState<YearlyTrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [net, crime, comms, brs, trends] = await Promise.all([
          api.getNetworkSummary(),
          api.getCrimeSummary(),
          api.getCommunities(),
          api.getBridges(),
          api.getYearlyTrends(),
        ]);
        setNetSummary(net);
        setCrimeSummary(crime);
        setCommunities(comms);
        setBridges(brs.slice(0, 5));
        setYearlyTrends(trends);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const communityChartData = communities.map((c) => ({
    name: `C${c.community_id}`,
    community_id: c.community_id,
    size: c.size,
    internal_edges: c.internal_edges,
    color: COMMUNITY_COLORS[c.community_id]?.hex || '#06B6D4',
  }));

  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen">
      <Topbar
        onSearchClick={() => setIsSearchOpen(true)}
        title="Executive Analytics Dashboard"
        subtitle="Topological network metrics, Louvain clustering, bridge entities, and crime statistics context"
      />

      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectNode={(nodeId) => router.push(`/node-intelligence?node=${encodeURIComponent(nodeId)}`)}
      />

      <main className="flex-1 p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Top Metric Cards Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Benchmark Nodes"
            value={netSummary ? netSummary.total_nodes.toLocaleString() : '1,650'}
            subtitle="Ego network instances"
            icon={Network}
            badge="GPlus Ego"
            accentColor="text-cyan-400"
            onClick={() => router.push('/explorer')}
          />

          <MetricCard
            title="Network Edges"
            value={netSummary ? netSummary.total_edges.toLocaleString() : '151,766'}
            subtitle={`Density: ${netSummary ? netSummary.density : '0.1115'}`}
            icon={Layers}
            badge="11.1% Dense"
            accentColor="text-indigo-400"
            onClick={() => router.push('/explorer')}
          />

          <MetricCard
            title="Louvain Communities"
            value={netSummary ? netSummary.community_count : '8'}
            subtitle="Modularity Q: 0.584"
            icon={Users2}
            badge="8 Clusters"
            accentColor="text-purple-400"
            onClick={() => router.push('/communities')}
          />

          <MetricCard
            title="Cross-Cluster Bridges"
            value={netSummary ? netSummary.bridge_node_count.toLocaleString() : '1,539'}
            subtitle="High-betweenness links"
            icon={GitBranch}
            badge="Top Connectors"
            accentColor="text-amber-400"
            onClick={() => router.push('/bridge-analysis')}
          />
        </div>

        {/* Responsible Use Notice */}
        <DisclaimerBadge type="gplus" compact />

        {/* Two-Column Primary Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Louvain Community Size Distribution */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users2 className="w-4 h-4 text-purple-400" />
                  Louvain Community Distribution (8 Clusters)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Node member count across detected modularity partitions</p>
              </div>
              <Link href="/communities" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={communityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="size" name="Nodes in Cluster" radius={[6, 6, 0, 0]}>
                    {communityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Crime in India IPC Yearly Historical Trend */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  Crime in India Context: Yearly IPC Trend (2001–2012)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Macroscopic district aggregate totals across all states</p>
              </div>
              <Link href="/crime-context" className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                    formatter={(value: any) => [Number(value).toLocaleString(), 'Total IPC Incidents']}
                  />
                  <Line
                    type="monotone"
                    dataKey="total_crimes"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={{ fill: '#F59E0B', r: 4 }}
                    activeDot={{ r: 6, fill: '#FCD34D' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section: Top Bridge Nodes & Top Crime States */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Betweenness Bridge Nodes Table */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-amber-400" />
                  Top Critical Bridge Nodes
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Entities facilitating high inter-community information flow</p>
              </div>
              <Link href="/bridge-analysis" className="text-xs font-mono text-cyan-400 hover:text-cyan-300">
                View All →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500">
                    <th className="pb-3">Node ID</th>
                    <th className="pb-3">Community</th>
                    <th className="pb-3">Degree</th>
                    <th className="pb-3">Betweenness</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {bridges.map((b) => (
                    <tr key={b.node_id} className="hover:bg-slate-850 transition-colors">
                      <td className="py-2.5 text-white font-medium">{b.node_id.slice(-8)}</td>
                      <td className="py-2.5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px]" style={{ backgroundColor: `${b.color}20`, color: b.color }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: b.color }} />
                          Comm {b.community_id}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-300">{b.degree}</td>
                      <td className="py-2.5 text-amber-400">{b.betweenness_centrality.toFixed(5)}</td>
                      <td className="py-2.5 text-right">
                        <Link
                          href={`/node-intelligence?node=${encodeURIComponent(b.node_id)}`}
                          className="text-cyan-400 hover:text-cyan-300 font-sans text-[11px] underline"
                        >
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top States by Crime Volume */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-rose-400" />
                  Top States by IPC Crime Volume
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Aggregate statistics from Crime in India (2001-2012)</p>
              </div>
              <Link href="/crime-context" className="text-xs font-mono text-cyan-400 hover:text-cyan-300">
                View All States →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500">
                    <th className="pb-3">Rank</th>
                    <th className="pb-3">State / UT</th>
                    <th className="pb-3 text-right">Total IPC Crimes</th>
                    <th className="pb-3 text-right">Avg / Record</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {(crimeSummary?.top_states_by_volume || []).slice(0, 5).map((st, idx) => (
                    <tr key={st.state} className="hover:bg-slate-850 transition-colors">
                      <td className="py-2.5 text-slate-500">#{idx + 1}</td>
                      <td className="py-2.5 text-white font-sans font-medium">{st.state}</td>
                      <td className="py-2.5 text-right text-rose-300">{st.total_crimes.toLocaleString()}</td>
                      <td className="py-2.5 text-right text-slate-400">
                        {Math.round(st.total_crimes / 12).toLocaleString()} / yr
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
