// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './components/auth/LandingPage'; 
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm'; 
import Dashboard from './pages/Dashboard';
import './App.css';

// Dummy placeholders
const TenderList = () => <div>Tender List</div>;
const TenderCreate = () => <div>Create Tender</div>;
const BidList = () => <div>Bid List</div>;
const UserList = () => <div>User List</div>;
const Reports = () => <div>Reports</div>;
const Unauthorized = () => <div>Unauthorized Access</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* ✅ Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* ✅ Protected Routes under /app */}
            <Route path="/app" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Admin */}
              <Route path="users" element={
                <ProtectedRoute roles={['admin']}>
                  <UserList />
                </ProtectedRoute>
              } />
              <Route path="reports" element={
                <ProtectedRoute roles={['admin']}>
                  <Reports />
                </ProtectedRoute>
              } />

              {/* Procuring Entity */}
              <Route path="my-tenders" element={
                <ProtectedRoute roles={['procuring_entity']}>
                  <TenderList />
                </ProtectedRoute>
              } />
              <Route path="tender/create" element={
                <ProtectedRoute roles={['procuring_entity']}>
                  <TenderCreate />
                </ProtectedRoute>
              } />

              {/* Bidder */}
              <Route path="available-tenders" element={
                <ProtectedRoute roles={['bidder']}>
                  <TenderList />
                </ProtectedRoute>
              } />
              <Route path="my-bids" element={
                <ProtectedRoute roles={['bidder']}>
                  <BidList />
                </ProtectedRoute>
              } />

              {/* Shared */}
              <Route path="tenders" element={
                <ProtectedRoute roles={['admin', 'procuring_entity']}>
                  <TenderList />
                </ProtectedRoute>
              } />
              <Route path="bids" element={
                <ProtectedRoute roles={['admin', 'procuring_entity']}>
                  <BidList />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
