// frontend/src/pages/Dashboard.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { tenderAPI, bidAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  
  const { data: tenderStats, loading: tenderLoading } = useApi(
    () => tenderAPI.getAll({ page: 1, limit: 5 }),
    []
  );
  
  const { data: bidStats, loading: bidLoading } = useApi(
    () => bidAPI.getAll({ page: 1, limit: 5 }),
    []
  );

  const renderDashboardContent = () => {
    switch (user.role) {
      case 'admin':
        return (
          <div className="dashboard-admin">
            <div className="stats-cards">
              <div className="card">
                <div className="card-body">
                  <h3>Total Tenders</h3>
                  <p className="stat-number">
                    {tenderLoading ? 'Loading...' : tenderStats?.pagination?.totalItems || 0}
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h3>Total Bids</h3>
                  <p className="stat-number">
                    {bidLoading ? 'Loading...' : bidStats?.pagination?.totalItems || 0}
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h3>Active Tenders</h3>
                  <p className="stat-number">
                    {tenderLoading ? 'Loading...' : 
                     tenderStats?.data?.filter(t => t.status === 'active').length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'procuring_entity':
        return (
          <div className="dashboard-procuring">
            <h3>My Recent Tenders</h3>
            <div className="recent-items">
              {tenderLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              ) : (
                tenderStats?.data?.map(tender => (
                  <div key={tender.id} className="card">
                    <div className="card-body">
                      <h4>{tender.title}</h4>
                      <p className="text-muted">Status: {tender.status}</p>
                      <p className="text-muted">Deadline: {new Date(tender.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      
      case 'bidder':
        return (
          <div className="dashboard-bidder">
            <h3>My Recent Bids</h3>
            <div className="recent-items">
              {bidLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              ) : (
                bidStats?.data?.map(bid => (
                  <div key={bid.id} className="card">
                    <div className="card-body">
                      <h4>{bid.tender?.title || 'Tender'}</h4>
                      <p className="text-muted">Status: {bid.status}</p>
                      <p className="text-muted">Submitted: {new Date(bid.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      
      default:
        return <div>Welcome to TenderMS</div>;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}!</h1>
        <p className="text-muted">Role: {user.role}</p>
      </div>
      
      {renderDashboardContent()}
    </div>
  );
};

export default Dashboard;
