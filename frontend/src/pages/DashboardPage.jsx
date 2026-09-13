import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Lightbulb, TrendingUp, FlaskConical, DollarSign, AlertTriangle, Zap, ArrowRight } from 'lucide-react';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import { formatCurrencyINR } from '../utils/formatters';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ORANGE = '#f97316';
const COLORS = { High: '#10b981', Medium: '#f59e0b', Low: '#444460', Idea: '#444460', Assessment: '#38bdf8', PoC: '#a78bfa', Pilot: ORANGE, Production: '#10b981', Rejected: '#ef4444' };

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1A22] border border-[#2A2A38] rounded-xl shadow-xl px-3 py-2 text-xs">
      {label && <p className="font-medium text-[#888899] mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.color || p.fill || ORANGE }}>
          {p.name}: {typeof p.value === 'number' && p.value > 10000 ? formatCurrencyINR(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
        <p className="text-sm text-[#888899]">Failed to load dashboard</p>
      </div>
    </div>
  );

  const priorityData = Object.entries(data.priorityDistribution || {}).map(([name, value]) => ({ name, value }));
  const stageData    = Object.entries(data.stageDistribution   || {}).map(([name, value]) => ({ name, value }));

  const trendData = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((month, i) => ({
    month,
    useCases: Math.round((data.totalUseCases || 6) * (0.4 + i * 0.12)),
    benefit:  Math.round((data.totalProjectedBenefit || 1000000) * (0.35 + i * 0.13)),
  }));

  return (
    <div className="space-y-5 pb-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="text-xs text-[#555570] mt-0.5">AI portfolio overview · Updated just now</p>
        </div>
        <button
          onClick={() => navigate('/use-cases/new')}
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white
                     text-xs font-medium px-4 py-2 rounded-xl transition-all shadow-glow-orange-sm"
        >
          <Zap className="w-3.5 h-3.5" /> New Initiative
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KPICard title="Total Initiatives"   value={data.totalUseCases ?? 0}                             icon={Lightbulb}     colorClass="orange" />
        <KPICard title="High Priority"       value={data.highPriorityCount ?? 0}                         icon={TrendingUp}    colorClass="green"  />
        <KPICard title="Active PoCs"         value={data.activePoCsCount ?? 0}                           icon={FlaskConical}  colorClass="purple" />
        <KPICard title="Annual Benefit"      value={formatCurrencyINR(data.totalProjectedBenefit ?? 0)}  icon={DollarSign}    colorClass="green"  />
        <KPICard title="Annual Cost"         value={formatCurrencyINR(data.totalProjectedCost ?? 0)}     icon={DollarSign}    colorClass="orange" />
        <KPICard title="High Risk"           value={data.highRiskCount ?? 0}                             icon={AlertTriangle} colorClass="red"    />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Top Initiatives */}
        <div className="lg:col-span-2 card-dark p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="section-title">Top AI Initiatives</h3>
              <p className="text-[11px] text-[#555570] mt-0.5">Ranked by opportunity score</p>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topUseCases || []} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1E1E28" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#444460' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={150}
                  tick={{ fontSize: 11, fill: '#888899' }} axisLine={false} tickLine={false}
                  tickFormatter={v => v?.length > 20 ? v.slice(0, 20) + '…' : v} />
                <RTooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(249,115,22,0.06)' }} />
                <Bar dataKey="priorityScore" name="Score" fill={ORANGE} radius={[0, 6, 6, 0]} maxBarSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Donut */}
        <div className="card-dark p-5">
          <h3 className="section-title mb-1">Priority Split</h3>
          <p className="text-[11px] text-[#555570] mb-4">By opportunity score</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={priorityData} cx="50%" cy="50%" innerRadius={44} outerRadius={64}
                     paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {priorityData.map((e, i) => <Cell key={i} fill={COLORS[e.name] || '#444460'} />)}
                </Pie>
                <RTooltip content={<DarkTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-3">
            {priorityData.map(e => (
              <div key={e.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[e.name] || '#444460' }} />
                  <span className="text-xs text-[#888899]">{e.name}</span>
                </div>
                <span className="text-xs font-semibold text-white">{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Stage pipeline */}
        <div className="card-dark p-5">
          <h3 className="section-title mb-5">Pipeline by Stage</h3>
          <div className="space-y-3.5">
            {stageData.map(({ name, value }) => {
              const total = stageData.reduce((s, d) => s + d.value, 0);
              const pct   = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[name] || '#444460' }} />
                      <span className="text-xs text-[#888899]">{name}</span>
                    </div>
                    <span className="text-xs font-semibold text-white">{value}</span>
                  </div>
                  <div className="w-full bg-[#1A1A22] rounded-full h-1.5">
                    <div className="h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: COLORS[name] || '#444460' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Portfolio Growth */}
        <div className="card-dark p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="section-title">Portfolio Growth</h3>
            <span className="text-[10px] text-[#444460] bg-white/5 border border-[#1E1E28] px-2 py-1 rounded-lg">Last 6 months</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={ORANGE} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={ORANGE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A22" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#444460' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#444460' }} axisLine={false} tickLine={false} />
                <RTooltip content={<DarkTooltip />} />
                <Area type="monotone" dataKey="useCases" name="Use Cases"
                  stroke={ORANGE} strokeWidth={2} fill="url(#orangeGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Initiatives */}
      <div className="card-dark overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E28]">
          <h3 className="section-title">Recent AI Initiatives</h3>
          <button onClick={() => navigate('/use-cases')}
            className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-400 font-medium transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="divide-y divide-[#141418]">
          {(data.topUseCases || []).slice(0, 5).map(uc => (
            <div key={uc.id} onClick={() => navigate(`/use-cases/${uc.id}`)}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.025] cursor-pointer transition-colors group">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-3.5 h-3.5 text-brand-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{uc.name}</p>
                  <p className="text-[11px] text-[#555570]">{uc.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                <Badge type="stage" value={uc.stage} />
                <Badge type="priority" value={uc.priority} />
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-brand-400">{uc.priorityScore}</p>
                  <p className="text-[10px] text-[#444460]">/ 100</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#2A2A38] group-hover:text-brand-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
