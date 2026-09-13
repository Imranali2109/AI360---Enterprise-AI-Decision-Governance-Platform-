import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UseCasesPage from './pages/UseCasesPage';
import UseCaseFormPage from './pages/UseCaseFormPage';
import UseCaseDetailPage from './pages/UseCaseDetailPage';
import LLMComparisonPage from './pages/LLMComparisonPage';
import CostCalculatorPage from './pages/CostCalculatorPage';
import ROICalculatorPage from './pages/ROICalculatorPage';
import RiskGovernancePage from './pages/RiskGovernancePage';
import KnowledgeAssistantPage from './pages/KnowledgeAssistantPage';
import ReportsPage from './pages/ReportsPage';

import ProtectedRoute from './components/layout/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/use-cases" element={<UseCasesPage />} />
            <Route path="/use-cases/new" element={<UseCaseFormPage />} />
            <Route path="/use-cases/:id" element={<UseCaseDetailPage />} />
            <Route path="/use-cases/:id/edit" element={<UseCaseFormPage />} />
            <Route path="/llm-comparison" element={<LLMComparisonPage />} />
            <Route path="/cost-calculator" element={<CostCalculatorPage />} />
            <Route path="/roi-calculator" element={<ROICalculatorPage />} />
            <Route path="/risk-governance" element={<RiskGovernancePage />} />
            <Route path="/knowledge-assistant" element={<KnowledgeAssistantPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
