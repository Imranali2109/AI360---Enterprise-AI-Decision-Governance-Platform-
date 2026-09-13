import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import DemoModeBanner from '../components/ui/DemoModeBanner';
import { Play, Trophy, Zap, Clock, Star } from 'lucide-react';

const cardCls = 'card-dark p-5 flex flex-col';
const inputCls = `w-full bg-[#1A1A22] border border-[#2A2A38] rounded-xl px-4 py-2.5 text-sm text-white
  placeholder-[#555570] focus:outline-none focus:border-brand-500 focus:ring-2
  focus:ring-brand-500/20 transition-all`;

export default function LLMComparisonPage() {
  const [prompt, setPrompt]               = useState('');
  const [selectedModels, setSelectedModels] = useState(['gpt-4o', 'gemini-1.5-pro']);
  const [loading, setLoading]             = useState(false);
  const [results, setResults]             = useState(null);

  const availableModels = [
    { id: 'gpt-4o',           name: 'GPT-4o',              provider: 'OpenAI' },
    { id: 'gpt-4o-mini',      name: 'GPT-4o Mini',         provider: 'OpenAI' },
    { id: 'gemini-1.5-pro',   name: 'Gemini 1.5 Pro',      provider: 'Google' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash',    provider: 'Google' },
    { id: 'claude-3-5-sonnet',name: 'Claude 3.5 Sonnet',   provider: 'Anthropic' },
    { id: 'claude-3-haiku',   name: 'Claude 3 Haiku',      provider: 'Anthropic' },
  ];

  const providerColors = {
    OpenAI:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Google:    'text-sky-400 bg-sky-500/10 border-sky-500/20',
    Anthropic: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  };

  const toggle = (id) =>
    setSelectedModels(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);

  const handleEvaluate = async () => {
    if (!prompt.trim())              return toast.error('Please enter a prompt');
    if (!selectedModels.length)      return toast.error('Select at least one model');
    setLoading(true);
    try {
      const res = await api.post('/llm/evaluate', { prompt, models: selectedModels });
      setResults(res);
      toast.success('Evaluation complete');
    } catch (err) {
      toast.error('Evaluation failed — check backend is running');
    } finally {
      setLoading(false);
    }
  };

  const maxScore = results?.results ? Math.max(...results.results.map(r => r.overallScore)) : 0;

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div>
        <h1 className="page-title">LLM Comparison Lab</h1>
        <p className="text-xs text-[#555570] mt-0.5">Evaluate and compare AI models side-by-side for your enterprise use case</p>
      </div>

      {/* Config Card */}
      <div className="card-dark p-6 space-y-5">
        {/* Prompt */}
        <div>
          <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-1.5">
            Your Prompt
          </label>
          <textarea
            rows={4}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. Summarize this customer complaint and classify its severity: [complaint text]"
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* Model Selection */}
        <div>
          <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-3">
            Select Models to Compare
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableModels.map(m => {
              const selected = selectedModels.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggle(m.id)}
                  className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                    selected
                      ? 'bg-brand-500/10 border-brand-500/40 shadow-glow-orange-sm'
                      : 'bg-white/[0.03] border-[#252530] hover:border-[#333340] hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <span className={`text-sm font-semibold ${selected ? 'text-white' : 'text-[#888899]'}`}>
                      {m.name}
                    </span>
                    {selected && (
                      <div className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${providerColors[m.provider] || 'text-[#888899]'}`}>
                    {m.provider}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Button onClick={handleEvaluate} loading={loading} icon={Play}>
          {loading ? 'Evaluating...' : 'Run Evaluation'}
        </Button>
      </div>

      {/* Results */}
      {results && results.results && (
        <div className="space-y-4">
          {/* Winner banner */}
          {results.winner && (
            <div className="card-dark p-4 border border-brand-500/30 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-4 h-4 text-brand-400" />
              </div>
              <div>
                <p className="text-xs text-[#888899]">Best Overall Model</p>
                <p className="text-sm font-bold text-white">{results.winner}</p>
              </div>
              <p className="text-xs text-[#888899] ml-auto max-w-xs hidden md:block">{results.recommendation}</p>
            </div>
          )}

          {/* Result cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.results.map((res, idx) => (
              <div key={idx} className={`${cardCls} ${res.overallScore === maxScore ? 'border-brand-500/40' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">{res.modelName || res.model}</h3>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border mt-1 inline-block ${providerColors[res.provider] || 'text-[#888899]'}`}>
                      {res.provider || 'Unknown'}
                    </span>
                  </div>
                  <div className={`text-right ${res.overallScore === maxScore ? 'text-brand-400' : 'text-[#888899]'}`}>
                    <p className="text-2xl font-black">{res.overallScore}</p>
                    <p className="text-[10px]">/ 100</p>
                  </div>
                </div>

                {/* Response box */}
                <div className="flex-1 bg-[#0E0E12] border border-[#1E1E28] rounded-xl p-4 text-xs text-[#ccccdd] mb-4 overflow-y-auto max-h-48 whitespace-pre-wrap leading-relaxed">
                  {res.response || 'No response'}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#1E1E28]">
                  {[
                    { icon: Star,  label: 'Quality',   value: `${res.qualityScore}/100` },
                    { icon: Clock, label: 'Latency',   value: `${res.latencyMs || 0}ms` },
                    { icon: Zap,   label: 'Cost/call', value: `₹${((res.estimatedCostInr || 0) * 1000).toFixed(3)}` },
                  ].map(m => (
                    <div key={m.label} className="text-center p-2 bg-white/[0.025] rounded-lg">
                      <p className="text-[10px] text-[#555570] uppercase mb-1">{m.label}</p>
                      <p className="text-xs font-semibold text-white">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
