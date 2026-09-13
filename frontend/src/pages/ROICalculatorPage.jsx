import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import { TrendingUp, DollarSign, Clock, Percent } from 'lucide-react';
import { formatCurrencyINR, formatPercent } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const inputCls = `w-full bg-[#1A1A22] border border-[#2A2A38] rounded-xl px-4 py-2.5 text-sm text-white
  placeholder-[#555570] focus:outline-none focus:border-brand-500 focus:ring-2
  focus:ring-brand-500/20 transition-all`;

const labelCls = 'block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-1.5';

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1A22] border border-[#2A2A38] rounded-xl shadow-xl px-3 py-2 text-xs">
      {label && <p className="text-[#888899] mb-1 font-medium">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {formatCurrencyINR(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function ROICalculatorPage() {
  // Store as strings so user can freely type
  const [params, setParams] = useState({
    employees:               '100',
    hoursPerMonthPerEmployee:'40',
    hourlyCost:              '1000',
    automationPercentage:    '30',
    implementationCost:      '2000000',
    annualOperatingCost:     '500000',
  });
  const [results, setResults] = useState(null);

  const handleChange = (e) => setParams(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCalculate = async () => {
    try {
      const payload = {
        employees:               parseInt(params.employees)               || 0,
        hoursPerMonthPerEmployee:parseInt(params.hoursPerMonthPerEmployee)|| 0,
        hourlyCost:              parseInt(params.hourlyCost)              || 0,
        automationPercentage:    parseInt(params.automationPercentage)    || 0,
        implementationCost:      parseInt(params.implementationCost)      || 0,
        annualOperatingCost:     parseInt(params.annualOperatingCost)     || 0,
      };
      const res = await api.post('/roi/calculate', payload);
      setResults(res);
    } catch (err) {
      toast.error('Failed to calculate ROI');
    }
  };

  const chartData = results ? [
    { year: 'Year 1', cost: (results.totalAnnualAiCost || 0) + (parseInt(params.implementationCost) || 0), benefit: results.annualBenefit || 0 },
    { year: 'Year 2', cost: results.totalAnnualAiCost || 0, benefit: results.annualBenefit || 0 },
    { year: 'Year 3', cost: results.totalAnnualAiCost || 0, benefit: results.annualBenefit || 0 },
  ] : [];

  const fields = [
    { name: 'employees',                label: 'No. of Employees',         placeholder: '100',     prefix: '' },
    { name: 'hoursPerMonthPerEmployee', label: 'Manual Hours / Employee / Month', placeholder: '40', prefix: '' },
    { name: 'hourlyCost',              label: 'Hourly Employee Cost (₹)',  placeholder: '1000',    prefix: '₹' },
    { name: 'automationPercentage',    label: 'Automation %',             placeholder: '30',      prefix: '' },
    { name: 'implementationCost',      label: 'Implementation Cost (₹)',  placeholder: '2000000', prefix: '₹' },
    { name: 'annualOperatingCost',     label: 'Annual Operating Cost (₹)',placeholder: '500000',  prefix: '₹' },
  ];

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h1 className="page-title">ROI Calculator</h1>
        <p className="text-xs text-[#555570] mt-0.5">Calculate return on investment and payback period for your AI initiative</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Inputs */}
        <div className="card-dark p-6 lg:col-span-1">
          <h3 className="section-title mb-5">Input Parameters</h3>
          <div className="space-y-4">
            {fields.map(f => (
              <div key={f.name}>
                <label className={labelCls}>{f.label}</label>
                <div className="relative">
                  {f.prefix && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#555570]">{f.prefix}</span>
                  )}
                  <input
                    type="number"
                    name={f.name}
                    value={params[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    min="0"
                    className={`${inputCls} ${f.prefix ? 'pl-8' : ''}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button onClick={handleCalculate} icon={TrendingUp} className="w-full justify-center">
              Calculate ROI
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {results ? (
            <>
              {/* KPI cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Annual Benefit',   value: formatCurrencyINR(results.annualBenefit || 0),    icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                  { label: 'Annual AI Cost',    value: formatCurrencyINR(results.totalAnnualAiCost || 0),icon: DollarSign, color: 'text-brand-400',    bg: 'bg-brand-500/10 border-brand-500/20' },
                  { label: 'ROI',               value: `${Math.round(results.roiPercent || 0)}%`,        icon: Percent,    color: results.roiPercent >= 0 ? 'text-emerald-400' : 'text-red-400', bg: results.roiPercent >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20' },
                  { label: 'Payback Period',    value: `${Math.round(results.paybackMonths || 0)} mo`,   icon: Clock,      color: 'text-sky-400',     bg: 'bg-sky-500/10 border-sky-500/20' },
                ].map(k => (
                  <div key={k.label} className="card-dark p-4">
                    <div className={`w-8 h-8 rounded-lg ${k.bg} border flex items-center justify-center mb-3`}>
                      <k.icon className={`w-4 h-4 ${k.color}`} />
                    </div>
                    <p className="stat-label mb-1">{k.label}</p>
                    <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="card-dark p-5">
                <h3 className="section-title mb-4">3-Year Cost vs Benefit</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1A1A22" vertical={false} />
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#888899' }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} tick={{ fontSize: 10, fill: '#888899' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(249,115,22,0.06)' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', color: '#888899' }} />
                      <Bar dataKey="cost"    name="Total Cost"   fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={36} />
                      <Bar dataKey="benefit" name="Annual Benefit" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="card-dark flex flex-col items-center justify-center h-64 text-center p-8">
              <TrendingUp className="w-10 h-10 text-[#252530] mb-3" />
              <p className="text-sm text-[#888899]">Fill in the parameters and click Calculate ROI</p>
              <p className="text-xs text-[#444460] mt-1">Results will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
