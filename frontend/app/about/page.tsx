'use client';

import React from 'react';
import { ShieldCheck, Info, Users, Database, Layers, CheckCircle2 } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { DisclaimerBadge } from '@/components/layout/DisclaimerBadge';

export default function AboutPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen">
      <Topbar
        title="About NetworkTrace & Responsible Data Framework"
        subtitle="Project mission, dataset integrity principles, and data ethics standards"
      />

      <main className="flex-1 p-8 space-y-8 max-w-5xl w-full mx-auto">
        {/* Project Statement */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Project Vision & Architecture</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>NetworkTrace</strong> is a research-grade network intelligence and graph analytics platform developed to combine complex network topology, community detection, centrality metrics, and supervised machine learning into a high-performance interactive interface.
          </p>
        </div>

        {/* Responsible Data Ethics Charter */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Responsible Data Use & Ethical Charter</h3>
          </div>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-cyan-400 font-mono">1. GPlus Social Circles Benchmark:</strong>
              <p className="text-slate-400">
                The GPlus dataset is utilized solely as a structural, topological graph benchmark for evaluating Louvain clustering and betweenness algorithms. Nodes do not represent criminal entities.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-amber-400 font-mono">2. Crime in India Contextual Statistics:</strong>
              <p className="text-slate-400">
                Published by the National Crime Records Bureau (NCRB) covering 2001–2012, this dataset represents macroscopic district-level and state-level historical counts. It is never mapped to individual user identities or graph node IDs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-emerald-400 font-mono">3. Synthetic Criminal Network Simulation:</strong>
              <p className="text-slate-400">
                The 60-person, 3-organization, 4-location simulation is explicitly generated with synthetic parameters to validate cross-community detection algorithms. All entities are fictional.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-purple-400 font-mono">4. No Unsupported Criminality Scoring:</strong>
              <p className="text-slate-400">
                NetworkTrace adheres to responsible AI principles and never computes unvalidated &quot;threat scores&quot; or individual criminality probabilities for real persons.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
