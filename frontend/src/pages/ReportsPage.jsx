import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ScoreCard from '../components/ui/ScoreCard';
import KPICard from '../components/ui/KPICard';
import { FileText, Printer, CheckCircle, BrainCircuit, ShieldAlert, Check } from 'lucide-react';
import { formatCurrencyINR } from '../utils/formatters';

const selectCls = `w-full bg-[#1A1A22] border border-[#2A2A38] rounded-xl px-4 py-2.5 text-sm text-white
  focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all`;

export default function ReportsPage() {
  const [useCases, setUseCases] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/use-cases').then(res => setUseCases(Array.isArray(res) ? res : [])).catch(console.error);
  }, []);

  const handleGenerate = async () => {
    if (!selectedId) return toast.error('Select a use case first');
    setLoading(true);
    try {
      const res = await api.get(`/reports/${selectedId}`);
      setReport(res);
      toast.success('Report generated');
    } catch (err) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const selectedUseCasePreview = useCases.find(u => u.id === selectedId);
  const handlePrint = () => window.print();

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-6rem)] pb-12">
      {/* Left Sidebar (No Print) */}
      <div className="w-full lg:w-80 flex-shrink-0 space-y-5 no-print">
        <div>
          <h1 className="page-title">Executive Reports</h1>
          <p className="text-xs text-[#555570] mt-0.5">Generate comprehensive PDF reports for AI initiatives.</p>
        </div>

        <div className="card-dark p-6">
          <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-2">Select AI Initiative</label>
          <select 
            className={selectCls}
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="" className="bg-[#1A1A22]">-- Select an Initiative --</option>
            {useCases.map(uc => <option key={uc.id} value={uc.id} className="bg-[#1A1A22]">{uc.name}</option>)}
          </select>

          {selectedUseCasePreview && (
            <div className="mt-4 p-4 bg-[#141418] rounded-xl border border-[#1E1E28]">
              <h4 className="font-semibold text-white text-sm">{selectedUseCasePreview.name}</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge type="stage" value={selectedUseCasePreview.department} />
                <Badge type="priority" value={selectedUseCasePreview.priority} />
              </div>
            </div>
          )}

          <Button onClick={handleGenerate} loading={loading} disabled={!selectedId} className="w-full mt-6" icon={FileText}>
            Generate Report
          </Button>

          {report && (
            <Button onClick={handlePrint} variant="secondary" className="w-full mt-3" icon={Printer}>
              Print to PDF
            </Button>
          )}
        </div>
      </div>

      {/* Right Content - The Report */}
      <div className="flex-1">
        {report ? (
          <div className="bg-[#141418] border border-[#1E1E28] rounded-2xl p-8 lg:p-12 shadow-2xl print:shadow-none print:border-none print:p-0 print:bg-white print:text-black">
            
            {/* Report Header */}
            <div className="flex items-start justify-between border-b border-[#252530] pb-8 mb-8 print:border-gray-200">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white tracking-tight print:text-black">AI360</span>
                </div>
                <h1 className="text-3xl font-bold text-white print:text-black">{report.useCase.name}</h1>
                <p className="text-[#888899] mt-2 print:text-gray-600">Executive Summary & Assessment Report</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white print:text-black">Date</p>
                <p className="text-xs text-[#888899] print:text-gray-500">{new Date().toLocaleDateString()}</p>
                <p className="text-sm font-semibold text-white mt-4 print:text-black">Prepared By</p>
                <p className="text-xs text-[#888899] print:text-gray-500">AI360 Platform</p>
              </div>
            </div>

            {/* Scores Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#1A1A22] border border-[#2A2A38] rounded-xl p-4 flex flex-col items-center justify-center print:border-gray-200 print:bg-gray-50">
                <ScoreCard score={report.useCase.priorityScore} label="Opportunity Score" size="sm" />
              </div>
              {report.risk && (
                <div className="bg-[#1A1A22] border border-[#2A2A38] rounded-xl p-4 flex flex-col items-center justify-center print:border-gray-200 print:bg-gray-50">
                  <ScoreCard score={report.risk.riskScore} label="Risk Score" size="sm" />
                </div>
              )}
              {report.roi && (
                <>
                  <div className="bg-[#1A1A22] border border-[#2A2A38] rounded-xl p-4 text-center print:border-gray-200 print:bg-gray-50 flex flex-col justify-center">
                    <p className="text-2xl font-bold text-emerald-400 print:text-emerald-600">{Math.round(report.roi.roiPercent)}%</p>
                    <p className="text-xs text-[#888899] mt-1 print:text-gray-500">Projected ROI</p>
                  </div>
                  <div className="bg-[#1A1A22] border border-[#2A2A38] rounded-xl p-4 text-center print:border-gray-200 print:bg-gray-50 flex flex-col justify-center">
                    <p className="text-2xl font-bold text-sky-400 print:text-sky-600">{Math.round(report.roi.paybackMonths)}mo</p>
                    <p className="text-xs text-[#888899] mt-1 print:text-gray-500">Payback Period</p>
                  </div>
                </>
              )}
            </div>

            {/* Sections */}
            <div className="space-y-8">
              
              {/* Profile */}
              <div>
                <h3 className="text-lg font-semibold text-white border-b border-[#252530] pb-2 mb-4 print:text-black print:border-gray-200">1. Initiative Profile</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><p className="text-xs text-[#555570] uppercase">Department</p><p className="font-medium text-white print:text-black">{report.useCase.department}</p></div>
                  <div><p className="text-xs text-[#555570] uppercase">Stage</p><p className="font-medium text-white print:text-black">{report.useCase.stage}</p></div>
                  <div><p className="text-xs text-[#555570] uppercase">Priority</p><p className="font-medium text-white print:text-black">{report.useCase.priority}</p></div>
                </div>
              </div>

              {/* Financials */}
              {report.roi && (
                <div>
                  <h3 className="text-lg font-semibold text-white border-b border-[#252530] pb-2 mb-4 print:text-black print:border-gray-200">2. Financial Projection</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4 print:bg-orange-50 print:border-orange-200">
                      <p className="text-xs text-[#888899] mb-1 print:text-gray-600">Annual Benefit</p>
                      <p className="text-xl font-bold text-brand-400 print:text-orange-600">{formatCurrencyINR(report.roi.annualBenefit)}</p>
                    </div>
                    <div className="bg-white/5 border border-[#1E1E28] rounded-xl p-4 print:bg-gray-50 print:border-gray-200">
                      <p className="text-xs text-[#888899] mb-1 print:text-gray-600">Implementation Cost</p>
                      <p className="text-xl font-bold text-white print:text-black">{formatCurrencyINR(report.roi.implementationCost)}</p>
                    </div>
                    <div className="bg-white/5 border border-[#1E1E28] rounded-xl p-4 print:bg-gray-50 print:border-gray-200">
                      <p className="text-xs text-[#888899] mb-1 print:text-gray-600">Annual Operating Cost</p>
                      <p className="text-xl font-bold text-white print:text-black">{formatCurrencyINR(report.roi.annualOperatingCost)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Risk */}
              {report.risk && (
                <div>
                  <h3 className="text-lg font-semibold text-white border-b border-[#252530] pb-2 mb-4 print:text-black print:border-gray-200">3. Risk & Governance</h3>
                  
                  {report.risk.recommendations?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-white mb-3 print:text-black">Action Items:</p>
                      <ul className="space-y-2">
                        {report.risk.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[#ccccdd] print:text-gray-700">
                            <ShieldAlert className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5 print:text-orange-500" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-4 p-4 bg-white/5 border border-[#1E1E28] rounded-xl text-sm text-[#888899] print:bg-gray-50 print:border-gray-200 print:text-gray-600">
                    Human Oversight Required: <span className="font-bold text-white print:text-black">{report.risk.humanOversightRequired ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              )}
              
            </div>
            
            <div className="mt-12 pt-6 border-t border-[#252530] text-center text-xs text-[#555570] print:border-gray-200 print:text-gray-400">
              Report generated by AI360 Enterprise Platform
            </div>
          </div>
        ) : (
          <div className="card-dark flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
            <FileText className="w-12 h-12 text-[#252530] mb-4" />
            <p className="text-base font-medium text-white mb-1">No Report Selected</p>
            <p className="text-sm text-[#888899]">Select an AI initiative from the sidebar to generate a PDF report</p>
          </div>
        )}
      </div>
    </div>
  );
}
