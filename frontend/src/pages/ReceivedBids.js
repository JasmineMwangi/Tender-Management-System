import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, MessageSquare, Calendar, Building, CheckCircle, XCircle, Clock } from 'lucide-react';

const ReceivedBids = () => {
  const [bids, setBids] = useState([]);
  const [filteredBids, setFilteredBids] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tenderFilter, setTenderFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedBid, setSelectedBid] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {

      setLoading(false);
    }, 1000);
  }, []);


  useEffect(() => {
    fetchReceivedBids();
  }, []);


  //  const mockBids = bids
  // write a funtion  to fetch recived bids from the backend
  const fetchReceivedBids = async () => {
    setLoading(true);
    // try {
    //   const response = await fetch('http://localhost:5000/api/bids/received', {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${localStorage.getItem('token')}`
    //     }
    //   }); 
    try {
      const response = await fetch('http://localhost:5000/api/bids/received', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bids');
      }
      const result = await response.json();
      setBids(result.data || []);
      setFilteredBids(result.data || []);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let filtered = bids;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(bid =>
        bid.bidNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bid => bid.status === statusFilter);
    }

    // Apply tender filter
    if (tenderFilter !== 'all') {
      filtered = filtered.filter(bid => bid.tender.id === tenderFilter);
    }

    setFilteredBids(filtered);
  }, [searchTerm, statusFilter, tenderFilter, bids]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'under_review':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount, currency = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const uniqueTenders = [...new Set(bids.map(bid => bid.tender.id))];

  const handleViewDetails = (bid) => {
    setSelectedBid(bid);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">📥 Received Bids</h1>
        <p className="text-gray-600">Manage and evaluate bids received for your published tenders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bids</p>
              <p className="text-2xl font-bold text-gray-900">{bids.length}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {bids.filter(b => b.status === 'rejected').length}
              </p>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-blue-600">
                {bids.filter(b => b.status === 'under_review').length}
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-green-600">
                {bids.filter(b => b.status === 'accepted').length}
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by bid number, tender title, or company..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {/* <option value="pending">Pending</option> */}
            <option value="under_review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Tender Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={tenderFilter}
            onChange={(e) => setTenderFilter(e.target.value)}
          >
            <option value="all">All Tenders</option>
            {uniqueTenders.map(tenderId => {
              const tender = bids.find(b => b.tender.id === tenderId)?.tender;
              return (
                <option key={tenderId} value={tenderId}>
                  {tender?.title}
                </option>
              );
            })}
          </select>

          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Bids Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bid Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bidder
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBids.map((bid) => (
                <tr key={bid.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{bid.id}</div>
                      <div className="text-sm text-gray-500">
                        <Calendar className="inline w-3 h-3 mr-1" />
                        {formatDate(bid.createdAt)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Timeline: {bid.proposedTimeline}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{bid.tender.title}</div>
                      <div className="text-sm text-gray-500">{bid.tender.category}</div>
                      <div className="text-sm text-gray-500">
                        Budget: {formatCurrency(bid.tender.budget)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{bid.user?.name}</div>
                      <div className="text-sm text-gray-500">{bid.user?.email}</div>
                      <div className="text-sm text-gray-500">
                        Team: {bid.teamSize} members
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(bid.amount, bid.currency)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {((bid.amount / bid.tender.budget) * 100).toFixed(1)}% of budget
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                      {getStatusIcon(bid.status)}
                      {bid.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {bid.totalScore ? (
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{bid.totalScore}%</div>
                        <div className="text-gray-500">
                          T: {bid.technicalScore}% | F: {bid.financialScore}%
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not evaluated</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(bid)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900 p-1 rounded"
                        title="Message Bidder"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBids.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No bids found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Bid Details Modal */}
      {showDetails && selectedBid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedBid.bidNumber}</h2>
                  <p className="text-gray-600">{selectedBid.tender.title}</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Bid Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Amount:</strong> {formatCurrency(selectedBid.amount)}</div>
                      <div><strong>Timeline:</strong> {selectedBid.proposedTimeline}</div>
                      <div><strong>Submitted:</strong> {formatDate(selectedBid.submittedAt)}</div>
                      <div><strong>Status:</strong>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedBid.status)}`}>
                          {selectedBid.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Company Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Company:</strong> {selectedBid.companyName}</div>
                      <div><strong>Email:</strong> {selectedBid.bidder.email}</div>
                      <div><strong>Phone:</strong> {selectedBid.bidder.phone}</div>
                      <div><strong>Team Size:</strong> {selectedBid.teamSize} members</div>
                      <div><strong>Experience:</strong> {selectedBid.experience}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Evaluation Scores</h3>
                    {selectedBid.totalScore ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Technical Score:</span>
                          <span className="font-medium">{selectedBid.technicalScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Financial Score:</span>
                          <span className="font-medium">{selectedBid.financialScore}%</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg border-t pt-2">
                          <span>Total Score:</span>
                          <span>{selectedBid.totalScore}%</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Not yet evaluated</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tender Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Category:</strong> {selectedBid.tender.category}</div>
                      <div><strong>Budget:</strong> {formatCurrency(selectedBid.tender.budget)}</div>
                      <div><strong>Deadline:</strong> {new Date(selectedBid.tender.deadline).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                {selectedBid.status === 'pending' && (
                  <>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Start Review
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Accept Bid
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      Reject Bid
                    </button>
                  </>
                )}
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                  Download Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivedBids;