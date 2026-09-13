import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import { Calculator, BarChart3 } from 'lucide-react';
import { formatCurrencyINR } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
        <p key={i} className="font-bold text-white">{formatCurrencyINR(p.value)}</p>
      ))}
    </div>
  );
};

export default function CostCalculatorPage() {
  const [params, setParams] = useState({
    users: '500',
    requestsPerUserPerDay: '20',
    avgInputTokens: '1000',
    avgOutputTokens: '500',
    workingDaysPerMonth: '22',
  });
  const [selectedModels, setSelectedModels] = useState(['gpt-4o', 'gpt-4o-mini', 'gemini-1.5-pro', 'claude-3-haiku']);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const availableModels = [
    { id: 'gpt-4o',          name: 'GPT-4o' },
    { id: 'gpt-4o-mini',     name: 'GPT-4o Mini' },
    { id: 'gemini-1.5-pro',  name: 'Gemini 1.5 Pro' },
    { id: 'gemini-1.5-flash',name: 'Gemini 1.5 Flash' },
    { id: 'claude-3-5-sonnet',name: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-haiku',  name: 'Claude 3 Haiku' },
  ];

  // Store as strings so user can freely type; parse only on submit
  const handleChange = (e) => setParams(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleToggleModel = (id) =>
    setSelectedModels(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);

  const handleCalculate = async () => {
    if (selectedModels.length === 0) return toast.error('Select at least one model');
    setLoading(true);
    try {
      // Parse strings to numbers only at submit time
      const payload = {
        users:                 parseInt(params.users)                 || 0,
        requestsPerUserPerDay: parseInt(params.requestsPerUserPerDay) || 0,
        avgInputTokens:        parseInt(params.avgInputTokens)        || 0,
        avgOutputTokens:       parseInt(params.avgOutputTokens)       || 0,
        workingDaysPerMonth:   parseInt(params.workingDaysPerMonth)   || 22,
        models:                selectedModels,
      };
      const res = await api.post('/cost/calculate', payload);
      setResults(res.results);
    } catch (err) {
      toast.error('Failed to calculate cost');
    } finally {
      setLoading(false);
    }
  };

  const ORANGE = '#f97316';
  const BAR_COLORS = ['#f97316', '#fb923c', '#fdba74', '#10b981', '#38bdf8', '#a78bfa'];

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div>
        <h1 className="page-title">AI Cost Calculator</h1>
        <p className="text-xs text-[#555570] mt-0.5">Estimate monthly & annual token costs across LLM providers in ₹</p>
      </div>

      {/* Inputs */}
      <div className="card-dark p-6">
        <h3 className="section-title mb-5">Usage Parameters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            { name: 'users',                 label: 'Number of Users',       placeholder: '500' },
            { name: 'requestsPerUserPerDay', label: 'Requests / User / Day', placeholder: '20' },
            { name: 'avgInputTokens',        label: 'Avg Input Tokens',      placeholder: '1000' },
            { name: 'avgOutputTokens',       label: 'Avg Output Tokens',     placeholder: '500' },
            { name: 'workingDaysPerMonth',   label: 'Working Days / Month',  placeholder: '22' },
          ].map(f => (
            <div key={f.name}>
              <label className={labelCls}>{f.label}</label>
              <input
                type="number"
                name={f.name}
                value={params[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                min="0"
                className={inputCls}
              />
            </div>
          ))}
        </div>

        {/* Model Selection */}
        <h3 className="section-title mb-3">Compare Models</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {availableModels.map(model => (
            <button
              key={model.id}
              onClick={() => handleToggleModel(model.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                selectedModels.includes(model.id)
                  ? 'bg-brand-500/15 text-brand-400 border-brand-500/30 shadow-glow-orange-sm'
                  : 'bg-white/5 text-[#888899] border-[#2A2A38] hover:bg-white/10 hover:text-white'
              }`}
            >
              {model.name}
            </button>
          ))}
        </div>

        <Button onClick={handleCalculate} loading={loading} icon={Calculator}>
          Calculate Cost
        </Button>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((res, idx) => (
              <div key={idx} className="card-dark p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">{res.modelName}</h3>
                  <span className="text-[10px] text-[#888899] bg-white/5 px-2 py-0.5 rounded-md border border-[#1E1E28]">
                    {res.provider}
                  </span>
                </div>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#888899]">Monthly</span>
                    <span className="text-sm font-semibold text-white">{formatCurrencyINR(res.monthlyCostInr)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2.5 border-t border-[#1E1E28]">
                    <span className="text-xs text-[#888899]">Annual</span>
                    <span className="text-sm font-bold text-brand-400">{formatCurrencyINR(res.annualCostInr)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#888899]">Requests / mo</span>
                    <span className="text-xs text-white">{(res.monthlyRequests || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          <div className="card-dark p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-4 h-4 text-brand-500" />
              <h3 className="section-title">Annual Cost Comparison</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A22" vertical={false} />
                  <XAxis dataKey="modelName" tick={{ fontSize: 11, fill: '#888899' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} tick={{ fontSize: 10, fill: '#888899' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(249,115,22,0.06)' }} />
                  <Bar dataKey="annualCostInr" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {results.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
