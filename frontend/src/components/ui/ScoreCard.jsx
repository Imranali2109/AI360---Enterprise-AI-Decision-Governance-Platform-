import React from 'react';

export default function ScoreCard({ score = 0, label = 'Score', size = 'md' }) {
  const color = score >= 75 ? '#10b981' : score >= 55 ? '#f59e0b' : '#555570';
  const radius = size === 'lg' ? 52 : 38;
  const stroke = size === 'lg' ? 7 : 5;
  const dim    = size === 'lg' ? 120 : 88;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} className="-rotate-90">
          <circle cx={dim / 2} cy={dim / 2} r={radius} fill="none" stroke="#1E1E28" strokeWidth={stroke} />
          <circle cx={dim / 2} cy={dim / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold text-white ${size === 'lg' ? 'text-2xl' : 'text-lg'}`}>{score}</span>
          <span className="text-[9px] text-[#555570] uppercase tracking-wider">/ 100</span>
        </div>
      </div>
      <p className="text-xs text-[#888899]">{label}</p>
    </div>
  );
}
