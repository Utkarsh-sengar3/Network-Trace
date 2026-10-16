'use client';

import React, { useState } from 'react';
import { Search, Sparkles, Terminal, Bell, HelpCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface TopbarProps {
  onSearchClick?: () => void;
  title?: string;
  subtitle?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ onSearchClick, title, subtitle }) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-20 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {title ? (
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>WORKSPACE / HYBRID GRAPH ENGINE</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Command Search Bar */}
        <button
          onClick={onSearchClick}
          className="flex items-center gap-3 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-colors shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Quick search nodes, states, models...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-900 border border-slate-700 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Action Buttons */}
        <Link
          href="/docs"
          className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-colors"
          title="API Documentation"
        >
          <HelpCircle className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};
