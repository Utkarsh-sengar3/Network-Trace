'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Network,
  Users2,
  Cpu,
  GitBranch,
  Shield,
  BarChart3,
  BrainCircuit,
  Binary,
  BookOpen,
  Info,
  Layers,
  FileCode2,
  ChevronRight,
  Activity,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Overview' },
  { href: '/explorer', label: 'Network Explorer', icon: Network, category: 'Graph Analytics', badge: '151k' },
  { href: '/communities', label: 'Community Explorer', icon: Users2, category: 'Graph Analytics', badge: '8' },
  { href: '/node-intelligence', label: 'Node Intelligence', icon: Cpu, category: 'Graph Analytics' },
  { href: '/bridge-analysis', label: 'Bridge Analysis', icon: GitBranch, category: 'Graph Analytics', highlight: true },
  { href: '/synthetic', label: 'Synthetic Network', icon: Shield, category: 'Simulation', badge: 'Demo' },
  { href: '/crime-context', label: 'Crime Context', icon: BarChart3, category: 'Context Statistics', badge: 'IPC' },
  { href: '/ml', label: 'Supervised ML', icon: BrainCircuit, category: 'Machine Learning' },
  { href: '/ml/model-performance', label: 'Model Simulator', icon: Binary, category: 'Machine Learning' },
  { href: '/methodology', label: 'Methodology', icon: BookOpen, category: 'Documentation' },
  { href: '/about', label: 'About & Ethics', icon: Info, category: 'Documentation' },
  { href: '/docs', label: 'API & Specs', icon: FileCode2, category: 'Documentation' },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              NetworkTrace
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400 tracking-wider block">HYBRID INTELLIGENCE</span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {['Overview', 'Graph Analytics', 'Simulation', 'Context Statistics', 'Machine Learning', 'Documentation'].map((category) => {
          const categoryItems = NAV_ITEMS.filter((item) => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category} className="space-y-1">
              <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-2">
                {category}
              </div>
              {categoryItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href) && item.href !== '/ml');

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                        item.highlight 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Telemetry Status Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>FastAPI: 8000</span>
          </div>
          <span className="text-emerald-400 font-semibold">ONLINE</span>
        </div>
        <div className="mt-1 text-[10px] text-slate-500">Ego: 100129275726588145876</div>
      </div>
    </aside>
  );
};
