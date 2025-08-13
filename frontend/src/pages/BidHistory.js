import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Eye, Calendar, DollarSign, Building, 
  CheckCircle, XCircle, Clock, AlertCircle, TrendingUp,
  Download, FileText, ArrowLeft, Send, BarChart3, Target
} from 'lucide-react';



const BidHistory = () => {
  const [bids, setBids] = useState([]);
  const [stats, setStats] = useState(null);
  const [filteredBids, setFilteredBids] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedBid, setSelectedBid] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [timeline, setTimeline] = useState([]);

  // Mock current user ID (replace with actual user context)
  const currentUserId = 1;

  // Mock data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => {
      const mockStats = {
        total: 15,
        pending: 3,
        under_review: 2,
        accepted: 6,
        rejected: 3,
        withdrawn: 1,
        successRate: 40.0,
        avgBidAmount: 127500,
        recentActivity: 5
      };

      const mockBids = [
        {
          id: '1',
          bidNumber: 'BID-20250107-1234',
          tender: {
            id: 't1',
            title: 'Website Development Project',
            category: 'IT Services',
            budget: 50000,
            deadline: '2025-01-20',
            status: 'open',
            organisation: {
              name: 'Tech Innovators Ltd',
              email: 'contact@techinnovators.co.ke'
            }
          },
          amount: 45000,
          currency: 'KES',
          status: 'accepted',
          submittedAt: '2025-01-05T10:30:00Z',
          reviewedAt: '2025-01-06T14:20:00Z',
          proposedTimeline: '8 weeks',
          technicalScore: 85,
          financialScore: 92,
          totalScore: 88.5,
          companyName: 'My Digital Solutions',
          evaluationNotes: 'Excellent technical proposal with competitive pricing. Timeline is realistic.'
        },
        {
          id: '2',
          bidNumber: 'BID-20250104-5678',
          tender: {
            id: 't2',
            title: 'Office Renovation Project',
            category: 'Construction',
            budget: 200000,
            deadline: '2025-01-15',
            status: 'closed',
            organisation: {
              name: 'BuildCorp Kenya',
              email: 'info@buildcorp.co.ke'
            }
          },
          amount: 185000,
          currency: 'KES',
          status: 'rejected',
          submittedAt: '2025-01-02T09:15:00Z',
          reviewedAt: '2025-01-04T16:45:00Z',
          proposedTimeline: '6 weeks',
          technicalScore: 75,
          financialScore: 68,
          totalScore: 72.2,
          companyName: 'My Construction Co',
          evaluationNotes: 'Good technical approach but pricing was above budget expectations.'
        },
        {
          id: '3',
          bidNumber: 'BID-20250103-9101',
          tender: {
            id: 't3',
            title: 'Mobile App Development',
            category: 'IT Services',
            budget: 80000,
            deadline: '2025-01-18',
            status: 'open',
            organisation: {
              name: 'StartupHub Kenya',
              email: 'hello@startuphub.co.ke'
            }
          },
          amount: 75000,
          currency: 'KES',
          status: 'under_review',
          submittedAt: '2025-01-01T11:20:00Z',
          reviewedAt: '2025-01-02T10:30:00Z',
          proposedTimeline: '10 weeks',
          companyName: 'My Digital Solutions'
        },
       
      ];

      setBids(mockBids);
      setFilteredBids(mockBids);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter functionality
  useEffect(() => {
    let filtered = bids;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(bid => 
        bid.bidNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.tender.organisation.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bid => bid.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(bid => bid.tender.category === categoryFilter);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (dateRange) {
        case '7days':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(now.getDate() - 90);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(bid => 
          new Date(bid.submittedAt) >= startDate
        );
      }
    }

    setFilteredBids(filtered);
  }, [searchTerm, statusFilter, categoryFilter, dateRange, bids]);

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
      case 'withdrawn':
        return <ArrowLeft className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under_review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const handleViewDetails = (bid) => {
    setSelectedBid(bid);
    setShowDetails(true);
  };

  const handleViewTimeline = (bid) => {
    // Mock timeline data - replace with API call
    const mockTimeline = [
      {
        id: 1,
        event: 'Bid Submitted',
        description: `Your bid of ${formatCurrency(bid.amount)} was submitted successfully`,
        timestamp: bid.submittedAt,
        status: 'completed',
        icon: Send
      }
    ];

    if (bid.reviewedAt) {
      mockTimeline.push({
        id: 2,
        event: 'Under Review',
        description: 'Your bid is being evaluated by the organization',
        timestamp: bid.reviewedAt,
        status: bid.status === 'under_review' ? 'current' : 'completed',
        icon: Eye
      });
    }

    if (bid.status === 'accepted') {
      mockTimeline.push({
        id: 3,
        event: 'Bid Accepted',
        description: 'Congratulations! Your bid has been accepted',
        timestamp: bid.updatedAt || bid.reviewedAt,
        status: 'completed',
        icon: CheckCircle
      });
    } else if (bid.status === 'rejected') {
      mockTimeline.push({
        id: 3,
        event: 'Bid Rejected',
        description: 'Unfortunately, your bid was not selected',
        timestamp: bid.updatedAt || bid.reviewedAt,
        status: 'completed',
        icon: XCircle
      });
    } else if (bid.status === 'withdrawn') {
      mockTimeline.push({
        id: 3,
        event: 'Bid Withdrawn',
        description: bid.withdrawalReason || 'Bid was withdrawn',
        timestamp: bid.withdrawnAt,
        status: 'completed',
        icon: ArrowLeft
      });
    }

    setTimeline(mockTimeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
    setSelectedBid(bid);
    setShowTimeline(true);
  };

  const uniqueCategories = [...new Set(bids.map(bid => bid.tender.category))];

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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">📊 My Bid History</h1>
        <p className="text-gray-600">Track all your submitted bids and their progress</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bids</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">{stats.successRate}%</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Bid Amount</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.avgBidAmount).replace('.00', '')}
                </p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recent Activity</p>
                <p className="text-2xl font-bold text-orange-600">{stats.recentActivity}</p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <div className="bg-orange-100 p-2 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Summary */}
      {stats && (
        <div className="bg-white p-4 rounded-lg shadow border mb-6">
          <h3 className="text-lg font-semibold mb-4">Bid Status Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Pending</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Under Review</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.under_review}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Accepted</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700">Rejected</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <ArrowLeft className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Withdrawn</span>
              </div>
              <p className="text-2xl font-bold text-gray-600">{stats.withdrawn}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by bid number, tender title, or organization..."
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
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>

          {/* Category Filter */}
          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Date Range Filter */}
          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
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
                  Bid Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tender Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
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
                      <div className="font-medium text-gray-900">{bid.bidNumber}</div>
                      <div className="text-sm text-gray-500">
                        <Calendar className="inline w-3 h-3 mr-1" />
                        Submitted: {formatDate(bid.submittedAt)}
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
                      <div className="text-sm text-gray-500">
                        Deadline: {new Date(bid.tender.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{bid.tender.organisation.name}</div>
                      <div className="text-sm text-gray-500">{bid.tender.organisation.email}</div>
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
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(bid.status)}`}>
                      {getStatusIcon(bid.status)}
                      {bid.status.replace('_', ' ').toUpperCase()}
                    </span>
                    {bid.status === 'withdrawn' && bid.withdrawalReason && (
                      <div className="text-xs text-gray-500 mt-1">
                        {bid.withdrawalReason}
                      </div>
                    )}
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
                        onClick={() => handleViewTimeline(bid)}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded"
                        title="View Timeline"
                      >
                        <BarChart3 className="w-4 h-4" />
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
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
                    <h3 className="text-lg font-semibold mb-2">Your Bid Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Bid Amount:</strong> {formatCurrency(selectedBid.amount)}</div>
                      <div><strong>Proposed Timeline:</strong> {selectedBid.proposedTimeline}</div>
                      <div><strong>Company:</strong> {selectedBid.companyName}</div>
                      <div><strong>Submitted:</strong> {formatDate(selectedBid.submittedAt)}</div>
                      <div><strong>Status:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded text-xs border ${getStatusColor(selectedBid.status)}`}>
                          {selectedBid.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tender Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Title:</strong> {selectedBid.tender.title}</div>
                      <div><strong>Category:</strong> {selectedBid.tender.category}</div>
                      <div><strong>Budget:</strong> {formatCurrency(selectedBid.tender.budget)}</div>
                      <div><strong>Deadline:</strong> {new Date(selectedBid.tender.deadline).toLocaleDateString()}</div>
                      <div><strong>Status:</strong> {selectedBid.tender.status}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Organization</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {selectedBid.tender.organisation.name}</div>
                      <div><strong>Email:</strong> {selectedBid.tender.organisation.email}</div>
                    </div>
                  </div>

                  {selectedBid.totalScore && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Evaluation Results</h3>
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
                        {selectedBid.evaluationNotes && (
                          <div className="mt-3">
                            <strong>Evaluation Notes:</strong>
                            <p className="text-gray-600 mt-1">{selectedBid.evaluationNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                <button
                  onClick={() => handleViewTimeline(selectedBid)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  View Timeline
                </button>
                {selectedBid.status === 'pending' && (
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Withdraw Bid
                  </button>
                )}
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                  Download Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Modal */}
      {showTimeline && selectedBid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Bid Timeline</h2>
                  <p className="text-gray-600">{selectedBid.bidNumber} - {selectedBid.tender.title}</p>
                </div>
                <button
                  onClick={() => setShowTimeline(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {timeline.map((event, index) => {
                  const Icon = event.icon;
                  const isLast = index === timeline.length - 1;
                  const isCurrent = event.status === 'current';
                  
                  return (
                    <div key={event.id} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`p-2 rounded-full ${
                          isCurrent ? 'bg-blue-600 text-white' : 
                          event.status === 'completed' ? 'bg-green-600 text-white' : 
                          'bg-gray-300 text-gray-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {!isLast && <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{event.event}</h4>
                          {isCurrent && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(event.timestamp)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidHistory;