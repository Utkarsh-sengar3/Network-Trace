'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, Search, Filter, Calendar, MapPin, Layers, TrendingUp } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { DisclaimerBadge } from '@/components/layout/DisclaimerBadge';
import { api } from '@/lib/api';
import { CrimeSummary, StateCrimeItem, DistrictCrimeItem, CategorySummaryItem, YearlyTrendItem } from '@/lib/types';
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

export default function CrimeContextPage() {
  const [summary, setSummary] = useState<CrimeSummary | null>(null);
  const [states, setStates] = useState<StateCrimeItem[]>([]);
  const [districts, setDistricts] = useState<DistrictCrimeItem[]>([]);
  const [categories, setCategories] = useState<CategorySummaryItem[]>([]);
  const [yearlyTrends, setYearlyTrends] = useState<YearlyTrendItem[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [districtSearch, setDistrictSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sum, st, dist, cat, yr] = await Promise.all([
          api.getCrimeSummary(),
          api.getStates(),
          api.getDistricts({ limit: 100 }),
          api.getCategories(),
          api.getYearlyTrends(),
        ]);
        setSummary(sum);
        setStates(st);
        setDistricts(dist);
        setCategories(cat);
        setYearlyTrends(yr);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (selectedState) {
      api.getDistricts({ state: selectedState, limit: 100 })
        .then((res) => setDistricts(res));
      api.getYearlyTrends(selectedState)
        .then((res) => setYearlyTrends(res));
    }
  }, [selectedState]);

  const filteredDistricts = districtSearch
    ? districts.filter((d) => d.district.toLowerCase().includes(districtSearch.toLowerCase()))
    : districts;

  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen">
      <Topbar
        title="Crime in India Context Dashboard"
        subtitle="National Crime Records Bureau (NCRB) IPC statistics (9,017 district records, 2001–2012)"
      />

      <main className="flex-1 p-8 space-y-8 max-w-7xl w-full mx-auto">
        <DisclaimerBadge type="crime" />

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Total IPC Incidents (2001-12)</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {summary ? summary.total_ipc_crimes.toLocaleString() : '47,881,308'}
            </div>
            <div className="text-[11px] text-amber-400 mt-0.5">Across all Indian States & UTs</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase">States & Union Territories</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {summary ? summary.total_states_uts : '35'} Jurisdictions
            </div>
            <div className="text-[11px] text-cyan-400 mt-0.5">Comprehensive coverage</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Reporting Districts</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {summary ? summary.total_districts : '600+'} Districts
            </div>
            <div className="text-[11px] text-purple-400 mt-0.5">District totals separated</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase">IPC Crime Categories</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {categories.length} Categories
            </div>
            <div className="text-[11px] text-rose-400 mt-0.5">Theft, Burglary, Violent, Fraud</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Yearly Trend */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Yearly Crime Trajectory (2001–2012)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedState ? `Filtered for ${selectedState}` : 'Nationwide Total IPC Incidents'}
                </p>
              </div>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(v: any) => [Number(v).toLocaleString(), 'Total IPC Incidents']}
                  />
                  <Line type="monotone" dataKey="total_crimes" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown BarChart */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Top IPC Categories by Incident Volume
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Aggregate proportions across all recorded years</p>
              </div>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories.slice(0, 7)} layout="vertical" margin={{ left: 40, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                  <YAxis type="category" dataKey="category" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} width={120} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(v: any) => [Number(v).toLocaleString(), 'Incidents']}
                  />
                  <Bar dataKey="total_incidents" fill="#06B6D4" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* State & District Explorer Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* State Rankings */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                State Rankings (Click to Filter)
              </h3>
              <button
                onClick={() => setSelectedState('')}
                className="text-xs font-mono text-cyan-400 hover:underline"
              >
                Reset Filter
              </button>
            </div>

            <div className="overflow-y-auto max-h-96">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500 sticky top-0 bg-slate-900">
                    <th className="pb-3">Rank</th>
                    <th className="pb-3">State / UT</th>
                    <th className="pb-3 text-right">Total Crimes</th>
                    <th className="pb-3 text-right">Districts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {states.map((st) => (
                    <tr
                      key={st.state}
                      onClick={() => setSelectedState(st.state)}
                      className={`hover:bg-slate-850 cursor-pointer transition-colors ${
                        selectedState === st.state ? 'bg-cyan-950/40 text-cyan-300' : ''
                      }`}
                    >
                      <td className="py-2.5 text-slate-500">#{st.rank}</td>
                      <td className="py-2.5 text-white font-sans font-medium">{st.state}</td>
                      <td className="py-2.5 text-right text-rose-300">{st.total_crimes.toLocaleString()}</td>
                      <td className="py-2.5 text-right text-slate-400">{st.districts_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* District Explorer */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-400" />
                District Statistics {selectedState ? `(${selectedState})` : ''}
              </h3>
              <input
                type="text"
                placeholder="Search district..."
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="overflow-y-auto max-h-96">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500 sticky top-0 bg-slate-900">
                    <th className="pb-3">District</th>
                    <th className="pb-3">State</th>
                    <th className="pb-3 text-right">Total Crimes</th>
                    <th className="pb-3 text-right">Avg / Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredDistricts.slice(0, 100).map((d) => (
                    <tr key={`${d.state}-${d.district}`} className="hover:bg-slate-850 transition-colors">
                      <td className="py-2.5 text-white font-sans font-medium">{d.district}</td>
                      <td className="py-2.5 text-slate-400 font-sans">{d.state}</td>
                      <td className="py-2.5 text-right text-rose-300">{d.total_crimes.toLocaleString()}</td>
                      <td className="py-2.5 text-right text-slate-400">{Math.round(d.average_crimes).toLocaleString()}</td>
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
