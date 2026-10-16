'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Network, Users2, Shield, BarChart3, BrainCircuit, X, CornerDownLeft } from 'lucide-react';
import { api } from '@/lib/api';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode?: (nodeId: string) => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({ isOpen, onClose, onSelectNode }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.getNodes({ search: query.trim(), limit: 8 });
        setResults(res.nodes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Input Header */}
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            placeholder="Search node IDs (e.g. 1001, 105), pages, or dataset parameters..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {loading && (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              Querying graph index...
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              No matching nodes found for &ldquo;{query}&rdquo;
            </div>
          )}

          {!loading && results.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Matching Graph Nodes ({results.length})
              </div>
              {results.map((node) => (
                <button
                  key={node.node_id}
                  onClick={() => {
                    if (onSelectNode) {
                      onSelectNode(node.node_id);
                    } else {
                      router.push(`/node-intelligence?node=${encodeURIComponent(node.node_id)}`);
                    }
                    onClose();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-800/80 flex items-center justify-between text-left group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: node.color }}
                    />
                    <div>
                      <div className="text-xs font-mono font-medium text-white group-hover:text-cyan-300">
                        Node {node.node_id}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Community {node.community_id} • Degree: {node.degree} • Betweenness: {node.betweenness_centrality.toFixed(4)}
                      </div>
                    </div>
                  </div>

                  {node.is_bridge && (
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
                      BRIDGE
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Quick Page Jump Shortcuts */}
          {query.length < 2 && (
            <div className="space-y-1 py-1">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Quick Navigation
              </div>
              {[
                { label: 'Interactive Network Explorer', href: '/explorer', icon: Network },
                { label: 'Louvain Community Explorer', href: '/communities', icon: Users2 },
                { label: 'Cross-Community Bridge Nodes', href: '/bridge-analysis', icon: Network },
                { label: 'Synthetic Criminal Demonstration', href: '/synthetic', icon: Shield },
                { label: 'Crime in India IPC Statistics', href: '/crime-context', icon: BarChart3 },
                { label: 'Supervised ML Regression Engine', href: '/ml', icon: BrainCircuit },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href);
                      onClose();
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center justify-between text-left group text-xs text-slate-300 hover:text-white"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <span>{item.label}</span>
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/80 text-[11px] font-mono text-slate-500 flex justify-between items-center">
          <span>Navigate with ↑ ↓ and ↵</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
};
