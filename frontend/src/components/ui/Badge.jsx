import React from 'react';

const priorityConfig = {
  High:   { label: 'High',   classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  Medium: { label: 'Medium', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  Low:    { label: 'Low',    classes: 'bg-white/5 text-[#888899] border-white/10' },
};
const stageConfig = {
  Idea:       { label: 'Idea',       classes: 'bg-white/5 text-[#888899] border-white/10' },
  Assessment: { label: 'Assessment', classes: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  PoC:        { label: 'PoC',        classes: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  Pilot:      { label: 'Pilot',      classes: 'bg-brand-500/10 text-brand-400 border-brand-500/20' },
  Production: { label: 'Production', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  Rejected:   { label: 'Rejected',   classes: 'bg-red-500/10 text-red-400 border-red-500/20' },
};
const riskConfig = {
  High:   { label: 'High Risk',   classes: 'bg-red-500/10 text-red-400 border-red-500/20' },
  Medium: { label: 'Medium Risk', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  Low:    { label: 'Low Risk',    classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
};

export default function Badge({ value, type = 'generic' }) {
  let config;
  if (type === 'priority') config = priorityConfig[value];
  else if (type === 'stage') config = stageConfig[value];
  else if (type === 'risk') config = riskConfig[value];
  const { label, classes } = config || { label: value, classes: 'bg-white/5 text-[#888899] border-white/10' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${classes}`}>
      {label}
    </span>
  );
}
