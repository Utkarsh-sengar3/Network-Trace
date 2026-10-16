'use client';

import React, { useState } from 'react';
import { BrainCircuit, Play, Sliders, CheckCircle2, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { DisclaimerBadge } from '@/components/layout/DisclaimerBadge';
import { api } from '@/lib/api';

export default function ModelPerformancePage() {
  // Crime Predictor State
  const [burglary, setBurglary] = useState<number>(450);
  const [theft, setTheft] = useState<number>(1800);
  const [robbery, setRobbery] = useState<number>(120);
  const [riots, setRiots] = useState<number>(300);
  const [cheating, setCheating] = useState<number>(400);
  const [murder, setMurder] = useState<number>(50);
  const [kidnapping, setKidnapping] = useState<number>(80);

  const [crimeResult, setCrimeResult] = useState<any | null>(null);
  const [crimeLoading, setCrimeLoading] = useState(false);

  // Synthetic Role Classifier State
  const [synthDegree, setSynthDegree] = useState<number>(12);
  const [synthBetweenness, setSynthBetweenness] = useState<number>(0.045);
  const [synthResult, setSynthResult] = useState<any | null>(null);
  const [synthLoading, setSynthLoading] = useState(false);

  async function handlePredictCrime(e: React.FormEvent) {
    e.preventDefault();
    setCrimeLoading(true);
    try {
      const res = await api.predictCrime({
        burglary,
        theft,
        robbery,
        riots,
        cheating,
        murder,
        kidnapping,
      });
      setCrimeResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setCrimeLoading(false);
    }
  }

  async function handlePredictSyntheticRole(e: React.FormEvent) {
    e.preventDefault();
    setSynthLoading(true);
    try {
      const res = await api.predictSyntheticRole({
        degree: synthDegree,
        betweenness_centrality: synthBetweenness,
      });
      setSynthResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSynthLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen">
      <Topbar
        title="Live Supervised ML Simulator & Inference Playground"
        subtitle="Test real-time predictions with custom crime incident vectors and topological network parameters"
      />

      <main className="flex-1 p-8 space-y-8 max-w-7xl w-full mx-auto">
        <DisclaimerBadge type="ml" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Simulator 1: Crime in India District IPC Regression */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  District IPC Crime Volume Forecaster
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Random Forest Regressor trained on 2001-2009 historical data. Enter category incident counts:
              </p>
            </div>

            <form onSubmit={handlePredictCrime} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">Theft Incidents: {theft}</label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="50"
                    value={theft}
                    onChange={(e) => setTheft(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Burglary: {burglary}</label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="25"
                    value={burglary}
                    onChange={(e) => setBurglary(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Cheating & Fraud: {cheating}</label>
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    step="20"
                    value={cheating}
                    onChange={(e) => setCheating(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Riots: {riots}</label>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="10"
                    value={riots}
                    onChange={(e) => setRiots(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Robbery: {robbery}</label>
                  <input
                    type="range"
                    min="0"
                    max="1500"
                    step="10"
                    value={robbery}
                    onChange={(e) => setRobbery(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Murder: {murder}</label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="5"
                    value={murder}
                    onChange={(e) => setMurder(Number(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={crimeLoading}
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{crimeLoading ? 'Running Inference...' : 'Calculate Forecasted IPC Total'}</span>
              </button>
            </form>

            {/* Crime Prediction Output Card */}
            {crimeResult && (
              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/40 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-purple-400 font-bold uppercase">Prediction Result</span>
                  <span className="text-[10px] font-mono text-slate-500">{crimeResult.model_used}</span>
                </div>

                <div className="text-2xl font-bold font-mono text-white">
                  {crimeResult.predicted_total_ipc.toLocaleString()}{' '}
                  <span className="text-xs font-sans text-slate-400 font-normal">total IPC crimes</span>
                </div>

                <div className="text-xs font-mono text-slate-400 flex items-center gap-4">
                  <span>
                    95% Confidence Interval:{' '}
                    <strong className="text-cyan-300">
                      [{crimeResult.confidence_interval?.lower_bound_95.toLocaleString()} –{' '}
                      {crimeResult.confidence_interval?.upper_bound_95.toLocaleString()}]
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Simulator 2: Synthetic Network Bridge Role Classifier */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Synthetic Bridge Role Classifier
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Random Forest Classifier predicting topological bridge roles from node centrality features:
              </p>
            </div>

            <form onSubmit={handlePredictSyntheticRole} className="space-y-4">
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">Degree (Connections): {synthDegree}</label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={synthDegree}
                    onChange={(e) => setSynthDegree(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">
                    Betweenness Centrality: {synthBetweenness.toFixed(4)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.15"
                    step="0.005"
                    value={synthBetweenness}
                    onChange={(e) => setSynthBetweenness(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={synthLoading}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{synthLoading ? 'Classifying...' : 'Classify Role'}</span>
              </button>
            </form>

            {/* Synthetic Output Card */}
            {synthResult && (
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-bold uppercase">Classification Output</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                    Synthetic
                  </span>
                </div>

                <div className="text-lg font-bold font-mono text-white">
                  {synthResult.entity_role_predicted}
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  Bridge Probability: <strong className="text-amber-400">{(synthResult.bridge_probability * 100).toFixed(1)}%</strong>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {synthResult.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
