import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KPICard({ title, value, subtitle, icon: Icon, colorClass = 'orange', trend }) {
  const palettes = {
    orange: { icon: 'text-brand-500',   bg: 'bg-brand-500/10',   border: 'border-brand-500/20' },
    green:  { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    blue:   { icon: 'text-sky-400',     bg: 'bg-sky-500/10',     border: 'border-sky-500/20' },
    purple: { icon: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20' },
    red:    { icon: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20' },
    yellow: { icon: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
    brand:  { icon: 'text-brand-500',   bg: 'bg-brand-500/10',   border: 'border-brand-500/20' },
    gray:   { icon: 'text-[#888899]',   bg: 'bg-white/5',        border: 'border-white/10' },
  };
  const p = palettes[colorClass] || palettes.orange;

  return (
    <div className="card-dark p-5 hover:border-[#32323f] transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-xl ${p.bg} border ${p.border} flex items-center justify-center flex-shrink-0`}>
          {Icon && <Icon className={`w-4 h-4 ${p.icon}`} strokeWidth={2} />}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full
            ${trend.direction === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
            {trend.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}
          </div>
        )}
      </div>
      <p className="stat-label mb-1">{title}</p>
      <p className="text-2xl font-bold text-white tracking-tight leading-none">{value}</p>
      {subtitle && <p className="text-xs text-[#555570] mt-1.5">{subtitle}</p>}
    </div>
  );
}
