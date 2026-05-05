import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout.jsx';
import RequireAuth from '@/components/RequireAuth.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import DashboardPage from '@/pages/DashboardPage.jsx';
import PackagesPage from '@/pages/PackagesPage.jsx';
import DestinationsPage from '@/pages/DestinationsPage.jsx';
import RegionContentPage from '@/pages/RegionContentPage.jsx';
import InquiriesPage from '@/pages/InquiriesPage.jsx';

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      element={
        <RequireAuth>
          <AdminLayout />
        </RequireAuth>
      }
    >
      <Route index element={<DashboardPage />} />
      <Route path="/packages" element={<PackagesPage />} />
      <Route path="/destinations" element={<DestinationsPage />} />
      <Route path="/region-content" element={<RegionContentPage />} />
      <Route path="/inquiries" element={<InquiriesPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
