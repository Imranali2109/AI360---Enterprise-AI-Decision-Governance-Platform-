import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, LayoutGrid, List, ArrowRight, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import { formatCurrencyINR } from '../utils/formatters';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function UseCasesPage() {
  const [useCases, setUseCases]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [view, setView]           = useState('table');
  const [search, setSearch]       = useState('');
  const [filterStage, setStage]   = useState('All');
  const navigate = useNavigate();

  useEffect(() => { fetchUseCases(); }, []);

  const fetchUseCases = () => {
    setLoading(true);
    api.get('/use-cases')
      .then(res => setUseCases(Array.isArray(res) ? res : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const stages = ['All', 'Idea', 'Assessment', 'PoC', 'Pilot', 'Production', 'Rejected'];

  const filtered = useCases.filter(uc => {
    const s = `${uc.name} ${uc.department}`.toLowerCase();
    return s.includes(search.toLowerCase()) && (filterStage === 'All' || uc.stage === filterStage);
  });

  const scoreColor = s => s >= 75 ? 'text-emerald-400' : s >= 55 ? 'text-amber-400' : 'text-[#444460]';

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">AI Use Cases</h1>
          <p className="text-xs text-[#555570] mt-0.5">{useCases.length} initiatives in portfolio</p>
        </div>
        <button onClick={() => navigate('/use-cases/new')}
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white
                     text-xs font-medium px-4 py-2 rounded-xl transition-all shadow-glow-orange-sm">
          <Plus className="w-3.5 h-3.5" /> New Use Case
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card-dark px-4 py-3 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#444460]" />
          <input type="text" placeholder="Search initiatives..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#1A1A22] border border-[#2A2A38]
                       rounded-lg text-white placeholder-[#444460] focus:outline-none
                       focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all" />
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {stages.map(s => (
            <button key={s} onClick={() => setStage(s)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors
                ${filterStage === s ? 'bg-brand-500 text-white shadow-glow-orange-sm' : 'bg-white/5 text-[#888899] hover:bg-white/10 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-[#141418] rounded-lg p-0.5 ml-auto border border-[#1E1E28]">
          {[['table', List], ['grid', LayoutGrid]].map(([v, Icon]) => (
            <button key={v} onClick={() => setView(v)}
              className={`p-1.5 rounded-md transition-colors ${view === v ? 'bg-[#252530] text-white' : 'text-[#444460] hover:text-white'}`}>
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="card-dark flex flex-col items-center justify-center py-16">
          <Lightbulb className="w-10 h-10 text-[#252530] mb-3" />
          <p className="text-sm font-medium text-[#888899]">No use cases found</p>
          <p className="text-xs text-[#444460] mt-1">Try adjusting search or filter</p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && view === 'table' && (
        <div className="card-dark overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E1E28]">
                {['Initiative', 'Department', 'Stage', 'Priority', 'Score', 'Est. Benefit', ''].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-[10px] font-semibold text-[#444460] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141418]">
              {filtered.map(uc => (
                <tr key={uc.id} onClick={() => navigate(`/use-cases/${uc.id}`)}
                  className="group cursor-pointer hover:bg-white/[0.025] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-3 h-3 text-brand-500" />
                      </div>
                      <span className="text-sm font-medium text-white truncate max-w-[180px]">{uc.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#888899]">{uc.department}</td>
                  <td className="py-3.5 px-4"><Badge type="stage" value={uc.stage} /></td>
                  <td className="py-3.5 px-4"><Badge type="priority" value={uc.priority} /></td>
                  <td className="py-3.5 px-4">
                    <span className={`text-sm font-bold ${scoreColor(uc.priorityScore)}`}>{uc.priorityScore}</span>
                    <span className="text-[10px] text-[#444460]">/100</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#888899] font-medium">{formatCurrencyINR(uc.annualSavings)}</td>
                  <td className="py-3.5 px-4">
                    <ArrowRight className="w-3.5 h-3.5 text-[#2A2A38] group-hover:text-brand-500 transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(uc => (
            <div key={uc.id} onClick={() => navigate(`/use-cases/${uc.id}`)}
              className="card-dark p-5 cursor-pointer hover:border-[#32323f] hover:shadow-card-dark-hover transition-all duration-200 group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-brand-500" />
                </div>
                <Badge type="stage" value={uc.stage} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">{uc.name}</h3>
              <p className="text-xs text-[#555570] mb-4">{uc.department}</p>
              <div className="flex items-center justify-between pt-3 border-t border-[#1E1E28]">
                <div className="flex items-center gap-2">
                  <Badge type="priority" value={uc.priority} />
                  <span className={`text-lg font-bold ${scoreColor(uc.priorityScore)}`}>{uc.priorityScore}</span>
                </div>
                <span className="text-xs text-[#888899] font-medium">{formatCurrencyINR(uc.annualSavings)}</span>
              </div>
              <div className="mt-3 w-full bg-[#1A1A22] rounded-full h-1">
                <div className="h-1 rounded-full bg-brand-500 transition-all"
                  style={{ width: `${uc.priorityScore || 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
