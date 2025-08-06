import React, { useState, useEffect } from 'react';

const BidList = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applied bids when component mounts
  useEffect(() => {
    fetchAppliedBids();
  }, []);
  
  const fetchAppliedBids = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('/api/bids', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed
          // 'Authorization': `Bearer ${token}`,
        },
      });

      console.log('API Response:', response);

      if (!response.ok) {
        throw new Error('Failed to fetch bids');
      }

      const data = await response.json();
      console.log('Response JSON:', data);
      
      // Handle different response structures
      if (Array.isArray(data)) {
        setBids(data);
      } else if (data.data && Array.isArray(data.data)) {
        setBids(data.data);
      } else {
        setBids([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching bids:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under review':
        return 'bg-blue-100 text-blue-800';
      case 'published':
        return 'bg-blue-100 text-blue-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">💼 Bid List</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-gray-600">Loading your bids...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">💼 Bid List</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading bids: {error}</p>
            <button
              onClick={fetchAppliedBids}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">💼 Bid List</h1>
        <button
          onClick={fetchAppliedBids}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {bids.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Bids Applied Yet</h3>
            <p className="text-gray-600">Your applied bids will appear here once you start bidding on projects.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map((bid, index) => (
            <div key={bid.id || index} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {bid.tender?.title || `Bid #${bid.bidNumber}` || bid.id}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {bid.tender?.description || `Tender ID: ${bid.tenderId}`}
                  </p>
                  <div className="flex gap-2 mb-2">
                    {bid.tender?.category && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                        {bid.tender.category}
                      </span>
                    )}
                    {bid.type && (
                      <span className="inline-block bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full">
                        Bid Type: {bid.type}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bid.status)}`}>
                  {bid.status || 'Pending'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Your Bid Amount</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(bid.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tender Budget</p>
                  <p className="font-semibold text-gray-900">
                    {bid.tender?.budget ? formatCurrency(bid.tender.budget) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted On</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(bid.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tender Deadline</p>
                  <p className="font-semibold text-gray-900">
                    {bid.tender?.deadline ? formatDate(bid.tender.deadline) : 'N/A'}
                  </p>
                </div>
              </div>

              {bid.proposedTimeline && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Your Proposed Timeline</p>
                  <p className="text-gray-900 font-medium">{bid.proposedTimeline}</p>
                </div>
              )}

              {bid.tender?.requirements && (
                <div className="border-t pt-4 mb-4">
                  <p className="text-sm text-gray-500 mb-2">Tender Requirements</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {bid.tender.requirements}
                  </p>
                </div>
              )}

              {bid.tender?.location && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-900 font-medium">{bid.tender.location}</p>
                </div>
              )}

              {bid.tender?.organisation && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Organization</p>
                  <p className="text-gray-900 font-medium">{bid.tender.organisation.name}</p>
                  <p className="text-sm text-gray-600">{bid.tender.organisation.email}</p>
                </div>
              )}

              {bid.proposalDocument && (
                <div className="border-t pt-4 mb-4">
                  <p className="text-sm text-gray-500 mb-2">Your Proposal Document</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <a 
                      href={bid.proposalDocument} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      📄 View Proposal Document
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-4 space-x-2">
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View Full Tender
                </button>
                {bid.status === 'submitted' && (
                  <button className="text-red-600 hover:text-red-800 font-medium">
                    Withdraw Bid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BidList;