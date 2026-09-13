import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import { Shield, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const sliderColor = (val) => {
  if (val >= 8) return 'text-red-400';
  if (val >= 5) return 'text-amber-400';
  return 'text-emerald-400';
};

const riskLevel = (score) => {
  if (score >= 70) return { label: 'High Risk', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
  if (score >= 40) return { label: 'Medium Risk', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
  return { label: 'Low Risk', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
};

export default function RiskGovernancePage() {
  const [params, setParams] = useState({
    dataSensitivity: 'Internal',
    dataLeakageRisk: 5, promptInjectionRisk: 5, unauthorizedAccessRisk: 5, excessivePermissionsRisk: 5,
    hallucinationRisk: 5, biasRisk: 5, reliabilityRisk: 5, explainabilityRisk: 5,
    financialImpactRisk: 5, customerImpactRisk: 5, regulatoryImpactRisk: 5,
    humanOversightRequired: true,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'range' ? Number(value) : value,
    }));
  };

  const handleAssess = async () => {
    setLoading(true);
    try {
      const res = await api.post('/risk/assess', params);
      setResults(res);
    } catch (err) {
      toast.error('Risk assessment failed');
    } finally {
      setLoading(false);
    }
  };

  const Slider = ({ name, label }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs text-[#888899]">{label}</label>
        <span className={`text-sm font-bold ${sliderColor(params[name])}`}>{params[name]}/10</span>
      </div>
      <input
        type="range" min="1" max="10" name={name} value={params[name]} onChange={handleChange}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-orange-500"
        style={{ background: `linear-gradient(to right, #f97316 0%, #f97316 ${(params[name]-1)/9*100}%, #1E1E28 ${(params[name]-1)/9*100}%, #1E1E28 100%)` }}
      />
    </div>
  );

  const radarData = results ? [
    { subject: 'Security',    value: Math.round((params.dataLeakageRisk + params.promptInjectionRisk + params.unauthorizedAccessRisk) / 3 * 10) },
    { subject: 'Responsible AI', value: Math.round((params.hallucinationRisk + params.biasRisk + params.explainabilityRisk) / 3 * 10) },
    { subject: 'Operational', value: Math.round((params.reliabilityRisk + params.excessivePermissionsRisk) / 2 * 10) },
    { subject: 'Business',    value: Math.round((params.financialImpactRisk + params.customerImpactRisk + params.regulatoryImpactRisk) / 3 * 10) },
  ] : [];

  const overallScore = results?.overallRiskScore ?? results?.riskScore ?? null;
  const risk = overallScore !== null ? riskLevel(overallScore) : null;

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h1 className="page-title">Risk & Governance</h1>
        <p className="text-xs text-[#555570] mt-0.5">Assess security, responsible AI, and business risk for your use case</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Inputs */}
        <div className="card-dark p-6 space-y-5">
          {/* Data Sensitivity */}
          <div>
            <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-1.5">Data Sensitivity</label>
            <select name="dataSensitivity" value={params.dataSensitivity} onChange={handleChange}
              className="w-full bg-[#1A1A22] border border-[#2A2A38] rounded-xl px-4 py-2.5 text-sm text-white
                         focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all">
              {['Public', 'Internal', 'Confidential', 'Highly Confidential'].map(v => (
                <option key={v} value={v} className="bg-[#1A1A22]">{v}</option>
              ))}
            </select>
          </div>

          {/* Human Oversight */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-[#1E1E28]">
            <span className="text-xs text-[#888899]">Human Oversight Required</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="humanOversightRequired" checked={params.humanOversightRequired} onChange={handleChange} className="sr-only peer" />
              <div className="w-9 h-5 bg-[#2A2A38] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500" />
            </label>
          </div>

          {/* Security Risks */}
          <div>
            <p className="text-xs font-semibold text-[#555570] uppercase tracking-wider mb-3">🔒 Security Risks</p>
            <Slider name="dataLeakageRisk"          label="Data Leakage" />
            <Slider name="promptInjectionRisk"       label="Prompt Injection" />
            <Slider name="unauthorizedAccessRisk"    label="Unauthorized Access" />
            <Slider name="excessivePermissionsRisk"  label="Excessive Permissions" />
          </div>

          {/* Responsible AI */}
          <div>
            <p className="text-xs font-semibold text-[#555570] uppercase tracking-wider mb-3">🤖 Responsible AI</p>
            <Slider name="hallucinationRisk"   label="Hallucination" />
            <Slider name="biasRisk"            label="Bias & Fairness" />
            <Slider name="reliabilityRisk"     label="Reliability" />
            <Slider name="explainabilityRisk"  label="Explainability" />
          </div>

          {/* Business Impact */}
          <div>
            <p className="text-xs font-semibold text-[#555570] uppercase tracking-wider mb-3">📊 Business Impact</p>
            <Slider name="financialImpactRisk"   label="Financial Impact" />
            <Slider name="customerImpactRisk"    label="Customer Impact" />
            <Slider name="regulatoryImpactRisk"  label="Regulatory Impact" />
          </div>

          <Button onClick={handleAssess} loading={loading} icon={Shield} className="w-full justify-center">
            Run Risk Assessment
          </Button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {results ? (
            <>
              {/* Overall Score */}
              <div className={`card-dark p-5 border ${risk.bg}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${risk.bg} border flex items-center justify-center`}>
                      <ShieldAlert className={`w-5 h-5 ${risk.color}`} />
                    </div>
                    <div>
                      <p className="stat-label">Overall Risk Score</p>
                      <p className={`text-3xl font-black ${risk.color}`}>{overallScore}<span className="text-sm font-normal text-[#555570]">/100</span></p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl ${risk.bg} border`}>
                    <span className={`text-sm font-bold ${risk.color}`}>{risk.label}</span>
                  </div>
                </div>
              </div>

              {/* Radar Chart */}
              <div className="card-dark p-5">
                <h3 className="section-title mb-4">Risk Radar</h3>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#1E1E28" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#888899' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#444460' }} />
                      <Radar name="Risk" dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.15} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recommendations */}
              {results.recommendations?.length > 0 && (
                <div className="card-dark p-5">
                  <h3 className="section-title mb-4">Governance Recommendations</h3>
                  <div className="space-y-2.5">
                    {results.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white/[0.025] rounded-xl border border-[#1E1E28]">
                        <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-[#ccccdd] leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card-dark flex flex-col items-center justify-center h-64 text-center p-8">
              <Shield className="w-10 h-10 text-[#252530] mb-3" />
              <p className="text-sm text-[#888899]">Adjust the risk sliders and click Run Risk Assessment</p>
              <p className="text-xs text-[#444460] mt-1">Results and recommendations will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
