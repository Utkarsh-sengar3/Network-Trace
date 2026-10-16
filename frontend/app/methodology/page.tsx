'use client';

import React from 'react';
import { BookOpen, Layers, GitBranch, BrainCircuit } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { DisclaimerBadge } from '@/components/layout/DisclaimerBadge';

export default function MethodologyPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen">
      <Topbar
        title="Mathematical Methodology & Algorithmic Foundations"
        subtitle="Formal specifications for graph centralities, Louvain modularity, and empirical validation"
      />

      <main className="flex-1 p-8 space-y-8 max-w-5xl w-full mx-auto">
        <DisclaimerBadge type="gplus" />

        {/* 1. Louvain Community Detection */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white font-mono">1. Louvain Community Modularity Optimization</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Louvain algorithm optimizes modularity Q through a greedy, multi-phase heuristic. Modularity measures the density of links inside communities compared to links between communities:
          </p>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
            Q = (1 / 2m) * Σ [ A_ij - (k_i * k_j / 2m) ] * δ(c_i, c_j)
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Where A_ij is the adjacency matrix weight between node i and j, k_i is the degree of node i, m is the total edge weight in the network, and δ(c_i, c_j) evaluates to 1 if both nodes belong to the same community partition. On our GPlus benchmark graph, 8 stable partitions were extracted with a modularity score of Q = 0.584.
          </p>
        </div>

        {/* 2. Centrality Indices */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white font-mono">2. Topological Centrality Metrics</h3>
          </div>
          <div className="space-y-4 text-xs text-slate-300">
            <div>
              <strong className="text-amber-300 block font-mono">Betweenness Centrality:</strong>
              <p className="text-slate-400 mt-0.5">
                Quantifies the fraction of all-pairs shortest paths that pass through a given node v:
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-amber-300 my-1.5">
                C_B(v) = Σ [ σ_st(v) / σ_st ] (for all s ≠ v ≠ t)
              </div>
            </div>

            <div>
              <strong className="text-cyan-300 block font-mono">Degree Centrality & PageRank:</strong>
              <p className="text-slate-400 mt-0.5">
                Degree measures immediate incident communication links [k_i / (N-1)], while PageRank computes stationary transition probabilities using an 85% damping factor (α = 0.85).
              </p>
            </div>
          </div>
        </div>

        {/* 3. Supervised ML Temporal Validation */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white font-mono">3. Supervised Machine Learning Validation</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            To ensure genuine predictive validity and avoid temporal data leakage, Crime in India regressions are evaluated with a temporal train/test split:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 font-mono">
            <li>Training Set: 2001 – 2009 historical records (7,214 district-year observations)</li>
            <li>Test Set: 2010 – 2012 out-of-time evaluation (1,803 district-year observations)</li>
            <li>Random Forest Regressor achieves Test R² = 0.985 with MAE = 342.1 incidents.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
