import React from 'react';
import { AlertTriangle, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { DATASET_DISCLAIMERS } from '@/lib/constants';

interface DisclaimerBadgeProps {
  type: 'gplus' | 'crime' | 'synthetic' | 'ml';
  compact?: boolean;
}

export const DisclaimerBadge: React.FC<DisclaimerBadgeProps> = ({ type, compact = false }) => {
  const configs = {
    gplus: {
      title: 'Structural Benchmark Graph',
      text: DATASET_DISCLAIMERS.gplus,
      badge: 'GPlus Social Benchmark',
      color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/50',
      icon: Info,
    },
    crime: {
      title: 'Macroscopic Crime Statistics',
      text: DATASET_DISCLAIMERS.crime,
      badge: 'NCRB IPC Statistics Context',
      color: 'text-amber-400 bg-amber-950/40 border-amber-800/50',
      icon: AlertTriangle,
    },
    synthetic: {
      title: 'Synthetic Demonstration',
      text: DATASET_DISCLAIMERS.synthetic,
      badge: 'Explicitly Synthetic Data',
      color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50',
      icon: ShieldAlert,
    },
    ml: {
      title: 'Supervised ML Diagnostics',
      text: DATASET_DISCLAIMERS.ml,
      badge: 'Validated ML Framework',
      color: 'text-purple-400 bg-purple-950/40 border-purple-800/50',
      icon: CheckCircle2,
    },
  };

  const c = configs[type];
  const Icon = c.icon;

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-full border ${c.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {c.badge}
      </span>
    );
  }

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${c.color}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider font-mono">{c.title}</h4>
        <p className="text-xs mt-1 leading-relaxed opacity-90">{c.text}</p>
      </div>
    </div>
  );
};
