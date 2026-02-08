// components/ProfileRouter.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminProfile from '../pages/AdminProfile';
import BidderProfile from '../pages/BidderProfile';
import OrganizationProfile from '../pages/OrganizationProfile';

const ProfileRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route based on user role
  const userRole = user.role?.toLowerCase();
  
  switch (userRole) {
    case 'admin':
    case 'super admin':
      return <AdminProfile />;
    
    case 'bidder':
      return <BidderProfile />;
    
    case 'organization':
      return <OrganizationProfile />;
    
    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unknown User Role</h2>
            <p className="text-gray-600">Your account role ({user.role}) is not recognized.</p>
            <p className="text-gray-600 mt-2">Please contact support.</p>
          </div>
        </div>
      );
  }
};

export default ProfileRouter;