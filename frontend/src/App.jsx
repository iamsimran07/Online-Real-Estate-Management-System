import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import DashboardLayout from './components/common/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ListingManagement from './pages/admin/ListingManagement';
import ActivityMonitoring from './pages/admin/ActivityMonitoring';
import SettingsPanel from './pages/admin/SettingsPanel';

// Property Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerProperties from './pages/manager/ManagerProperties';
import ManagerApplications from './pages/manager/ManagerApplications';
import ManagerAgreements from './pages/manager/ManagerAgreements';
import ManagerAnalytics from './pages/manager/ManagerAnalytics';
import Messages from './pages/manager/Messages';

// Tenant Pages
import TenantDashboard from './pages/tenant/TenantDashboard';
import TenantApplications from './pages/tenant/TenantApplications';
import TenantAgreements from './pages/tenant/TenantAgreements';
import TenantProfile from './pages/tenant/TenantProfile';

function App() {
  return (
    <Routes>
      {/* Public Pages with Standard Header */}
      <Route
        path="/"
        element={
          <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <Home />
          </div>
        }
      />
      <Route
        path="/properties"
        element={
          <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <Properties />
          </div>
        }
      />
      <Route
        path="/properties/:id"
        element={
          <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <PropertyDetail />
          </div>
        }
      />

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="listings" element={<ListingManagement />} />
        <Route path="activity" element={<ActivityMonitoring />} />
        <Route path="settings" element={<SettingsPanel />} />
      </Route>

      {/* Protected Property Manager Routes */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={['PROPERTY_MANAGER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboard />} />
        <Route path="properties" element={<ManagerProperties />} />
        <Route path="applications" element={<ManagerApplications />} />
        <Route path="agreements" element={<ManagerAgreements />} />
        <Route path="analytics" element={<ManagerAnalytics />} />
        <Route path="messages" element={<Messages />} />
      </Route>

      {/* Protected Tenant Routes */}
      <Route
        path="/tenant"
        element={
          <ProtectedRoute allowedRoles={['TENANT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TenantDashboard />} />
        <Route path="applications" element={<TenantApplications />} />
        <Route path="agreements" element={<TenantAgreements />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<TenantProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
