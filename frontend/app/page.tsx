'use client';

import React from 'react';
import Link from 'next/link';
import {
  Network,
  LayoutDashboard,
  Users2,
  GitBranch,
  Shield,
  BarChart3,
  BrainCircuit,
  ArrowRight,
  Layers,
  Sparkles,
  CheckCircle2,
  FileCode2,
  Activity,
  Terminal,
} from 'lucide-react';
import { DisclaimerBadge } from '@/components/layout/DisclaimerBadge';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 px-8 py-3 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>NETWORKTRACE v1.0.0 — GRAPH ANALYTICS & COMMUNITY INTELLIGENCE</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            FASTAPI OPERATIONAL
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-8 py-20 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950/80 to-slate-950 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Option F: Precision Intelligence Hybrid Architecture</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Graph-Based Network Intelligence & Community Analysis
          </h1>

          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Discover multi-cluster community structures, evaluate high-betweenness bridge entities, explore multi-relational synthetic scenarios, and forecast macroscopic crime patterns using topological graph theory and supervised machine learning.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/explorer"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Network className="w-4 h-4" />
              <span>Explore Network Graph</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-700 font-semibold text-sm transition-all hover:scale-[1.02] flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Open Executive Dashboard</span>
            </Link>

            <Link
              href="/ml/model-performance"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-700 font-semibold text-sm transition-all hover:scale-[1.02] flex items-center gap-2"
            >
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <span>Live ML Predictor</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
              <div className="text-xs font-mono text-slate-400 uppercase">Benchmark Nodes</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">1,650</div>
              <div className="text-[11px] text-cyan-400 mt-0.5">Ego network instance</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
              <div className="text-xs font-mono text-slate-400 uppercase">Topological Edges</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">151,766</div>
              <div className="text-[11px] text-cyan-400 mt-0.5">Density: 0.111558</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
              <div className="text-xs font-mono text-slate-400 uppercase">Louvain Clusters</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">8 Groups</div>
              <div className="text-[11px] text-purple-400 mt-0.5">Modularity Q: 0.584</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
              <div className="text-xs font-mono text-slate-400 uppercase">Crime in India IPC</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">9,017</div>
              <div className="text-[11px] text-amber-400 mt-0.5">District statistics (2001-12)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Capabilities Grid */}
      <section className="px-8 py-16 max-w-6xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Core Analytics & Intelligence Pillars
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Built with rigorous mathematical algorithms and verifiable empirical pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/explorer"
            className="p-6 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              Interactive Network Explorer
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Real-time WebGL/Canvas force-directed rendering with Louvain community isolation, shortest path tracing, and node neighborhood sampling.
            </p>
          </Link>

          <Link
            href="/bridge-analysis"
            className="p-6 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              Bridge Node Analysis
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Identify key structural bridges and bottlenecks connecting disparate network clusters using betweenness centrality and cross-edge ratios.
            </p>
          </Link>

          <Link
            href="/synthetic"
            className="p-6 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              Synthetic Criminal Network
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              60-node multi-relational demonstration modeling communication, organization, and location relationships without using real-person data.
            </p>
          </Link>

          <Link
            href="/crime-context"
            className="p-6 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
              Crime in India Context
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Macroscopic historical IPC statistics across 35 states and 9,017 district records from 2001 to 2012 with category trends.
            </p>
          </Link>

          <Link
            href="/ml"
            className="p-6 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
              Supervised ML Forecasting
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Random Forest and Gradient Boosting regressors trained on temporal splits (2001-2009 train, 2010-2012 test) for district crime prediction.
            </p>
          </Link>

          <Link
            href="/methodology"
            className="p-6 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <FileCode2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
              Methodology & Documentation
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Complete mathematical definitions, Jaccard evaluation matrices, Louvain modularity proofs, and FastAPI REST endpoints.
            </p>
          </Link>
        </div>
      </section>

      {/* Responsible Data Use Banner */}
      <section className="px-8 py-10 max-w-6xl mx-auto w-full">
        <DisclaimerBadge type="gplus" />
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/50 px-8 py-6 text-xs font-mono text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <div>NetworkTrace Platform • Option F Precision Hybrid</div>
        <div className="flex items-center gap-6">
          <Link href="/about" className="hover:text-cyan-400">About & Ethics</Link>
          <Link href="/methodology" className="hover:text-cyan-400">Methodology</Link>
          <Link href="/docs" className="hover:text-cyan-400">API Docs</Link>
        </div>
      </footer>
    </div>
  );
}
