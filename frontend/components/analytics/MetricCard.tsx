import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  badge?: string;
  accentColor?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  badge,
  accentColor = 'text-cyan-400',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all shadow-lg relative overflow-hidden ${
        onClick ? 'cursor-pointer hover:scale-[1.01] hover:bg-slate-850' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
            {title}
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tracking-tight">
            {value}
          </div>
        </div>

        <div className={`p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 ${accentColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        {subtitle && <span className="text-slate-400 font-medium">{subtitle}</span>}
        
        {change && (
          <span className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
            isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            {change}
          </span>
        )}

        {badge && (
          <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
