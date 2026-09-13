import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Shield, FileText, AlertTriangle } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import KPICard from '../components/ui/KPICard';
import ScoreCard from '../components/ui/ScoreCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatCurrencyINR, formatPercent } from '../utils/formatters';

export default function UseCaseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [useCase, setUseCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    api.get(`/use-cases/${id}`)
      .then(res => setUseCase(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!useCase) return <div className="p-4 text-red-500">Use case not found.</div>;

  const netBenefit = useCase.expectedAnnualSavings - useCase.annualOperatingCost;
  const roi = useCase.implementationCost > 0 ? (netBenefit / useCase.implementationCost) * 100 : 0;
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'financial', label: 'Financial Impact' },
    { id: 'technical', label: 'Technical Details' },
    { id: 'risk', label: 'Risk Assessment' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-2">
        <button onClick={() => navigate('/use-cases')} className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{useCase.name}</h1>
          <div className="mt-2 flex space-x-3">
            <Badge type="department" value={useCase.department} />
            <Badge type="stage" value={useCase.stage} />
            <Badge type="priority" value={useCase.priority} />
          </div>
        </div>
        <div className="ml-auto flex space-x-3">
          <Button variant="secondary" icon={Edit} onClick={() => navigate(`/use-cases/${id}/edit`)}>Edit</Button>
          <Button variant="secondary" icon={Shield} onClick={() => navigate('/risk-governance')}>Run Risk Check</Button>
          <Button icon={FileText} onClick={() => navigate('/reports')}>Generate Report</Button>
        </div>
      </div>

      <div className="border-b border-gray-200 mt-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Business Problem</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{useCase.businessProblem || 'Not specified.'}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Proposed AI Solution</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{useCase.proposedSolution || 'Not specified.'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-500">Number of Users</p>
                  <p className="text-xl font-semibold text-gray-900 mt-1">{useCase.numberOfUsers || 'N/A'}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-500">Data Sensitivity</p>
                  <p className="text-xl font-semibold text-gray-900 mt-1">{useCase.dataSensitivity || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div>
              <ScoreCard 
                score={useCase.priorityScore} 
                priority={useCase.priority} 
                breakdown={{
                  businessImpact: useCase.businessImpact,
                  technicalComplexity: useCase.technicalComplexity,
                  dataAvailability: useCase.dataAvailability,
                  adoptionPotential: useCase.adoptionPotential,
                  implementationEffort: useCase.implementationEffort
                }}
                recommendation={useCase.priorityScore > 75 ? 'Highly recommended to proceed to PoC.' : 'Needs refinement or better data availability.'}
              />
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard title="Implementation Cost" value={formatCurrencyINR(useCase.implementationCost)} colorClass="orange" />
              <KPICard title="Annual Op. Cost" value={formatCurrencyINR(useCase.annualOperatingCost)} colorClass="orange" />
              <KPICard title="Expected Annual Savings" value={formatCurrencyINR(useCase.expectedAnnualSavings)} colorClass="green" />
              <KPICard title="Net Annual Benefit" value={formatCurrencyINR(netBenefit)} colorClass={netBenefit > 0 ? 'green' : 'red'} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Return on Investment</h3>
              <div className="grid grid-cols-2 gap-8 max-w-2xl">
                <div>
                  <p className="text-sm text-gray-500">Est. ROI (Year 1)</p>
                  <p className={`text-4xl font-bold ${roi > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatPercent(roi)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payback Period</p>
                  <p className="text-4xl font-bold text-brand-600">
                    {netBenefit > 0 ? `${((useCase.implementationCost / netBenefit) * 12).toFixed(1)} Months` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'technical' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Complexity Breakdown</h3>
            <div className="space-y-4 max-w-2xl">
              <div>
                <p className="text-sm font-medium text-gray-700">Technical Complexity ({useCase.technicalComplexity}/10)</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2"><div className="bg-brand-600 h-2 rounded-full" style={{width: `${useCase.technicalComplexity*10}%`}}></div></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Implementation Effort ({useCase.implementationEffort}/10)</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2"><div className="bg-brand-600 h-2 rounded-full" style={{width: `${useCase.implementationEffort*10}%`}}></div></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Data Availability ({useCase.dataAvailability}/10)</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2"><div className="bg-brand-600 h-2 rounded-full" style={{width: `${useCase.dataAvailability*10}%`}}></div></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
             {useCase.riskAssessments && useCase.riskAssessments.length > 0 ? (
               <div>
                  <p className="text-2xl font-bold text-red-600">{useCase.riskAssessments[0].riskLevel} Risk</p>
                  <p className="text-gray-600 mt-2">Score: {useCase.riskAssessments[0].totalRiskScore}/100</p>
               </div>
             ) : (
               <div className="py-12">
                 <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                 <h3 className="text-lg font-medium text-gray-900">No Risk Assessment Found</h3>
                 <p className="mt-1 text-sm text-gray-500 mb-6">A formal risk assessment has not been conducted for this initiative.</p>
                 <Button onClick={() => navigate('/risk-governance')}>Conduct Risk Assessment</Button>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
