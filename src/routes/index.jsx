// src/routes/index.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import UserDashboard from '../pages/user/Dashboard';
import AdminDashboard from '../pages/admin/Dashboard';
import EmployerDashboard from '../pages/employer/Dashboard';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/user-dashboard"
      element={
        <ProtectedRoute allowedRoles={['user']}>
          <UserDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin-dashboard"
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/employer-dashboard"
      element={
        <ProtectedRoute allowedRoles={['employer']}>
          <EmployerDashboard />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
