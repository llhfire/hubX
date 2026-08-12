import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import Dashboard from './dashboard/Dashboard';
import RecordList from './records/RecordList';
import RecordForm from './records/RecordForm';
import TemplateList from './templates/TemplateList';
import TemplateForm from './templates/TemplateForm';
import CategoryManager from './categories/CategoryManager';
import ReportPage from './reports/ReportPage';

const FinancialCost: React.FC = () => {
  return (
    <Routes>
      {/* 默认重定向到费用记录 */}
      <Route path="/" element={<Navigate to="/financial-cost/records" replace />} />

      {/* 费用仪表盘 */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* 费用记录管理 */}
      <Route path="/records" element={<RecordList />} />
      <Route path="/records/create" element={<RecordForm />} />
      <Route path="/records/:id" element={<RecordForm />} />

      {/* 费用模板管理 */}
      <Route path="/templates" element={<TemplateList />} />
      <Route path="/templates/create" element={<TemplateForm />} />
      <Route path="/templates/:id" element={<TemplateForm />} />

      {/* 费用分类管理 */}
      <Route path="/categories" element={<CategoryManager />} />

      {/* 报表统计 */}
      <Route path="/reports" element={<ReportPage />} />
    </Routes>
  );
};

export default FinancialCost;
