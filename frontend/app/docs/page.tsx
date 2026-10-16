'use client';

import React from 'react';
import { FileCode2, Terminal, Server, Globe, ArrowRight, Code } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';

const API_ROUTES = [
  { method: 'GET', path: '/api/health', desc: 'System health check and service readiness status.' },
  { method: 'GET', path: '/api/network/summary', desc: '1,650 nodes, 151k edges, density, and connected components.' },
  { method: 'GET', path: '/api/network/nodes', desc: 'Paginated nodes directory with centrality and community filters.' },
  { method: 'GET', path: '/api/network/graph-view', desc: 'Level-of-Detail optimized graph view payload for Cytoscape.js.' },
  { method: 'GET', path: '/api/network/node/{node_id}', desc: 'Detailed node intelligence profile and centrality rankings.' },
  { method: 'GET', path: '/api/network/node/{node_id}/neighborhood', desc: 'Exact 1-hop / 2-hop ego subgraph extraction.' },
  { method: 'GET', path: '/api/network/communities', desc: '8 Louvain community cards, sizes, and internal/external density.' },
  { method: 'GET', path: '/api/network/bridges', desc: 'Ranked high-betweenness cross-community bridge entities.' },
  { method: 'POST', path: '/api/network/shortest-path', desc: 'Calculates Dijkstra/BFS shortest path between two graph nodes.' },
  { method: 'GET', path: '/api/crime/summary', desc: 'Crime in India (2001-2012) summary across 35 states & 9,017 records.' },
  { method: 'GET', path: '/api/crime/yearly', desc: 'Yearly total IPC crime volume from 2001 to 2012.' },
  { method: 'GET', path: '/api/crime/states', desc: 'State-wise total crimes, district counts, and rankings.' },
  { method: 'GET', path: '/api/crime/districts', desc: 'District-wise crime statistics (excluding aggregate TOTAL rows).' },
  { method: 'GET', path: '/api/synthetic/network', desc: 'Multi-relational synthetic network (60 people, 3 orgs, 4 locs).' },
  { method: 'GET', path: '/api/ml/metrics', desc: 'Supervised ML model metrics (R², MAE, RMSE, Confusion Matrix).' },
  { method: 'POST', path: '/api/ml/predict/crime', desc: 'Live supervised regression predicting district total IPC crime.' },
  { method: 'POST', path: '/api/ml/predict/synthetic-role', desc: 'Supervised classifier predicting synthetic bridge role.' },
];

export default function DocsPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen">
      <Topbar
        title="API Specifications & System Documentation"
        subtitle="FastAPI REST endpoints, Level-Of-Detail graph streaming, and client integration guide"
      />

      <main className="flex-1 p-8 space-y-8 max-w-5xl w-full mx-auto">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">FastAPI Backend Specifications (Port 8000)</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The NetworkTrace API is fully asynchronous, powered by FastAPI and Pydantic schemas, with OpenAPI documentation available at <code className="text-cyan-300 font-mono">http://127.0.0.1:8000/docs</code>.
          </p>
        </div>

        {/* Endpoints Table */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">REST Endpoints Catalog</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500">
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Endpoint Path</th>
                  <th className="pb-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {API_ROUTES.map((route) => (
                  <tr key={route.path} className="hover:bg-slate-850 transition-colors">
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        route.method === 'GET'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {route.method}
                      </span>
                    </td>
                    <td className="py-2.5 text-white">{route.path}</td>
                    <td className="py-2.5 text-slate-400 font-sans">{route.desc}</td>
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
