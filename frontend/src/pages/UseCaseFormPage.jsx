import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ArrowLeft, Save } from 'lucide-react';

export default function UseCaseFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    department: 'IT',
    stage: 'Idea',
    problem: '',
    solution: '',
    numUsers: 100,
    dataSensitivity: 'Internal',
    humanOversightRequired: false,
    businessImpact: 5,
    technicalComplexity: 5,
    dataAvailability: 5,
    adoptionPotential: 5,
    implementationEffort: 5,
    implementationCost: 500000,
    operatingCost: 100000,
    annualSavings: 2000000,
    manualHoursPerMonth: 500,
    timeSavingsPercent: 50,
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/use-cases/${id}`)
        .then(res => setFormData(res))
        .catch(() => {
          toast.error('Failed to load use case');
          navigate('/use-cases');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' || type === 'range') ? Number(value) : value
    }));
  };

  // Live score preview (simplified client-side calculation)
  const calculateLiveScore = () => {
    const s = formData;
    const businessImpact = (s.businessImpact / 10) * 100;
    const techFeasibility = ((11 - s.technicalComplexity) / 10) * 100;
    const dataAvail = (s.dataAvailability / 10) * 100;
    const adoption = (s.adoptionPotential / 10) * 100;
    const effort = ((11 - s.implementationEffort) / 10) * 100;

    const totalCost = (s.implementationCost || 0) + (s.operatingCost || 0);
    let roiScore = 0;
    if (totalCost > 0) {
      const roi = ((s.annualSavings - totalCost) / totalCost) * 100;
      roiScore = Math.min(100, Math.max(0, roi / 3));
    }

    const score = businessImpact * 0.30 + roiScore * 0.25 + techFeasibility * 0.20
      + dataAvail * 0.10 + adoption * 0.10 + effort * 0.05;
    return Math.round(score);
  };

  const liveScore = calculateLiveScore();
  const livePriority = liveScore >= 90 ? 'High' : liveScore >= 70 ? 'Medium' : 'Low';
  const priorityColor = { High: 'text-green-600', Medium: 'text-yellow-600', Low: 'text-gray-500' }[livePriority];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Use case name is required');
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/use-cases/${id}`, formData);
        toast.success('Use case updated successfully');
        navigate(`/use-cases/${id}`);
      } else {
        const res = await api.post('/use-cases', formData);
        toast.success('Use case created successfully');
        navigate(`/use-cases/${res.id}`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save use case');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const sliderClass = 'w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-[#1E1E28] accent-orange-500';
  const inputClass = 'input-dark mt-1';
  const labelClass = 'label-dark';

  const Section = ({ title, children }) => (
    <div className="card-dark p-6">
      <h3 className="text-base font-semibold text-white mb-5 pb-3 border-b border-[#1E1E28]">{title}</h3>
      <div className="space-y-5">{children}</div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-5 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-white/10 text-[#888899] hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="page-title">{isEdit ? 'Edit AI Use Case' : 'New AI Use Case'}</h1>
            <p className="text-xs text-[#555570] mt-0.5">Define the use case and scoring inputs to generate an opportunity score</p>
          </div>
        </div>

        {/* Live score preview */}
        <div className="hidden md:flex items-center gap-4 card-dark px-5 py-3">
          <div className="text-center">
            <div className={`text-3xl font-bold ${priorityColor}`}>{liveScore}</div>
            <div className="text-[10px] text-[#444460] uppercase tracking-wide">Score</div>
          </div>
          <div className="w-px h-10 bg-[#1E1E28]" />
          <div className="text-center">
            <div className={`text-sm font-semibold ${priorityColor}`}>{livePriority}</div>
            <div className="text-[10px] text-[#444460] uppercase tracking-wide">Priority</div>
          </div>
        </div>
      </div>

      {/* Section 1: Basic Info */}
      <Section title="1 — Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Use Case Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required
              className={inputClass} placeholder="e.g. HR Knowledge Assistant" />
          </div>
          <div>
            <label className={labelClass}>Department</label>
            <select name="department" value={formData.department} onChange={handleChange} className={inputClass}>
              {['HR', 'IT', 'Finance', 'Legal', 'Sales', 'Marketing', 'Operations', 'Engineering', 'Customer Service'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Stage</label>
            <select name="stage" value={formData.stage} onChange={handleChange} className={inputClass}>
              {['Idea', 'Assessment', 'PoC', 'Pilot', 'Production', 'Rejected'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Data Sensitivity</label>
            <select name="dataSensitivity" value={formData.dataSensitivity} onChange={handleChange} className={inputClass}>
              {['Public', 'Internal', 'Confidential', 'Personal', 'Sensitive'].map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Number of Users</label>
            <input type="number" name="numUsers" value={formData.numUsers} onChange={handleChange} min={1} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Business Problem</label>
            <textarea name="problem" value={formData.problem} onChange={handleChange} rows={3}
              className={inputClass} placeholder="Describe the current business problem..." />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Proposed AI Solution</label>
            <textarea name="solution" value={formData.solution} onChange={handleChange} rows={3}
              className={inputClass} placeholder="Describe how AI will solve this problem..." />
          </div>
          <div className="md:col-span-2 flex items-center space-x-3">
            <input type="checkbox" id="humanOversight" name="humanOversightRequired"
              checked={formData.humanOversightRequired} onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <label htmlFor="humanOversight" className="text-sm text-gray-700">
              Human Oversight Required (AI outputs must be reviewed before action)
            </label>
          </div>
        </div>
      </Section>

      {/* Section 2: Scoring Inputs */}
      <Section title="2 — Opportunity Scoring Inputs (1–10)">
        <p className="text-xs text-gray-500 -mt-2">These inputs drive the weighted opportunity score. Adjust the sliders to reflect your assessment.</p>
        <div className="space-y-6">
          {[
            { name: 'businessImpact', label: 'Business Impact', weight: '30%', low: 'Minimal', high: 'Transformative' },
            { name: 'technicalComplexity', label: 'Technical Complexity', weight: '20%', low: 'Simple', high: 'Very Complex', inverted: true },
            { name: 'dataAvailability', label: 'Data Availability', weight: '10%', low: 'Poor', high: 'Excellent' },
            { name: 'adoptionPotential', label: 'User Adoption Potential', weight: '10%', low: 'Low', high: 'High' },
            { name: 'implementationEffort', label: 'Implementation Effort', weight: '5%', low: 'Easy', high: 'Very Hard', inverted: true },
          ].map(({ name, label, weight, low, high, inverted }) => (
            <div key={name}>
              <div className="flex justify-between items-center mb-1">
                <label className={labelClass}>
                  {label} <span className="text-gray-400 text-xs font-normal">({weight} weight{inverted ? ', lower is better' : ''})</span>
                </label>
                <span className="text-sm font-bold text-blue-700">{formData[name]}/10</span>
              </div>
              <input type="range" name={name} min={1} max={10} value={formData[name]} onChange={handleChange} className={sliderClass} />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{low}</span><span>{high}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 3: Financial Estimates */}
      <Section title="3 — Financial Estimates">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { name: 'implementationCost', label: 'Implementation Cost (₹)', placeholder: '500000' },
            { name: 'operatingCost', label: 'Annual Operating Cost (₹)', placeholder: '100000' },
            { name: 'annualSavings', label: 'Expected Annual Savings (₹)', placeholder: '2000000' },
            { name: 'manualHoursPerMonth', label: 'Current Manual Hours / Month', placeholder: '500' },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className={labelClass}>{label}</label>
              <input type="number" name={name} value={formData[name]} onChange={handleChange} min={0} className={inputClass} placeholder={placeholder} />
            </div>
          ))}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={labelClass}>Expected Time Savings %</label>
              <span className="text-sm font-bold text-brand-400">{formData.timeSavingsPercent}%</span>
            </div>
            <input type="range" name="timeSavingsPercent" min={0} max={100} value={formData.timeSavingsPercent} onChange={handleChange} className={sliderClass} />
          </div>
        </div>
      </Section>

      {/* Submit */}
      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        <Button type="submit" loading={saving} icon={Save}>
          {isEdit ? 'Update Use Case' : 'Create Use Case'}
        </Button>
      </div>
    </form>
  );
}
