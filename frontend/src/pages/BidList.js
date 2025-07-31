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

      if (!response.ok) {
        throw new Error('Failed to fetch bids');
      }

      const data = await response.json();
      setBids(data.data || []); // Correct: data.data is the array
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                    {bid.projectTitle || bid.title || 'Tender Title'}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {bid.description || bid.projectDescription || 'No description available'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bid.status)}`}>
                  {bid.status || 'Pending'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Bid Amount</p>
                  <p className="font-semibold text-gray-900">
                    ${bid.bidAmount || bid.amount || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Applied On</p>
                  <p className="font-semibold text-gray-900">
                    {bid.appliedDate || bid.createdAt ? 
                      formatDate(bid.appliedDate || bid.createdAt) : 
                      'N/A'
                    }fetchAppliedBids
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p clfetchMyTendersassName="font-semibold text-gray-900">
                    {bid.deadline || bid.projectDeadline ? 
                      formatDate(bid.deadline || bid.projectDeadline) : 
                      'N/A'
                    }
                  </p>
                </div>
              </div>

              {bid.proposal && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">Your Proposal</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {bid.proposal}
                  </p>
                </div>
              )}

              <div className="flex justify-end mt-4 space-x-2">
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View Details
                </button>
                {bid.status === 'pending' && (
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


//tender title should be displayed as "Tender Title" or "Project Title" if available
//tender description should be displayed as "No description available" if not provided
//the description is a must for the tender to be valid