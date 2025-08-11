// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './components/auth/LandingPage';
import LoginForm from './components/auth/LoginForm';
import BidderRegister from './components/auth/BidderRegister';
import OrganizationRegister from './components/auth/OrganizationRegister';
import Dashboard from './pages/Dashboard';
import MyTenders from './pages/Mytenders';
import BidList from './pages/BidList';
import './App.css';
import ReceivedBids from './pages/ReceivedBids';

// Dummy placeholders - replace with actual components as you build them
const TenderList = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">📋 Tender List</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">Tender List component - Coming Soon</p>
    </div>
  </div>
);

const TenderCreate = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">➕ Create Tender</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">Create Tender component - Coming Soon</p>
    </div>
  </div>
);

// const BidList = () => (
//   <div className="p-6">
//     <h1 className="text-2xl font-bold text-gray-900 mb-4">💼 Bid List</h1>
//     <div className="bg-white rounded-lg shadow p-6">
//       <p className="text-gray-600">Bid List component - Coming Soon</p>
//     </div>
//   </div>
// );

const UserList = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">👥 User Management</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">User List component - Coming Soon</p>
    </div>
  </div>
);

const Reports = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">📊 Reports</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">Reports component - Coming Soon</p>
    </div>
  </div>
);

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
      <div className="text-red-500 text-6xl mb-4">🚫</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-4">You don't have permission to access this resource.</p>
      <button
        onClick={() => window.history.back()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* ✅ Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register/bidder" element={<BidderRegister />} />
            <Route path="/register/organization" element={<OrganizationRegister />} />
            {/* add bidList */}
            <Route path="/my-bids" element={<BidList />} />
            {/* <Route path="/app/bids/received" element={<ReceivedBids />} /> */}

            {/* 🔒 Protected Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* ✅ Protected Routes under /app */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* 🔐 Admin Only Routes */}
              <Route
                path="users"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <UserList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reports"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <Reports />
                  </ProtectedRoute>
                }
              />

              {/* 🏢 Procuring Entity Routes */}
              <Route
                path="my-tenders"
                element={
                  <ProtectedRoute role={['organisation']}>
                    <MyTenders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="bids/received"
                element={
                  <ProtectedRoute>
                    <ReceivedBids />
                  </ProtectedRoute>
                }
              />

              <Route
                path="tender/create"
                element={
                  <ProtectedRoute >
                    <TenderCreate />
                  </ProtectedRoute>
                }
              />

              {/* 👤 Bidder Routes */}
              <Route
                path="available-tenders"
                element={
                  <ProtectedRoute roles={['bidder']}>
                    <TenderList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-bids"
                element={
                  <ProtectedRoute roles={['bidder']}>
                    <BidList />
                  </ProtectedRoute>
                }
              />

              {/* 🔄 Shared Routes */}
              <Route
                path="tenders"
                element={
                  <ProtectedRoute roles={['admin', 'organisation']}>
                    <TenderList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="bids"
                element={
                  <ProtectedRoute roles={['admin', 'organisation']}>
                    <BidList />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 🚫 Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;