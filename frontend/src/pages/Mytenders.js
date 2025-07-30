import React, { useState, useEffect } from 'react';
import {
  Plus, Edit3, Trash2, Eye, Search, Filter, Calendar, DollarSign, Building, Clock,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import BidDialog from '../components/auth/BidDialog'; // Import the new component
import { useAuth } from '../contexts/AuthContext'; // adjust path if needed


const MyTenders = () => {
  const { user } = useAuth();
  const [tenders, setTenders] = useState([]);
  const [filteredTenders, setFilteredTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create', 'edit', 'view'
  const [selectedTender, setSelectedTender] = useState(null);

  // Add bid dialog state
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [bidTender, setBidTender] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    deadline: '',
    requirements: '',
    contactEmail: '',
    contactPhone: '',
    location: '',
    status: 'draft'
  });

  // API base URL - adjust according to your backend setup
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch tenders on component mount
  useEffect(() => {
    fetchMyTenders();
  }, []);

  // Filter tenders based on search and status
  useEffect(() => {
    let filtered = tenders;

    if (searchTerm) {
      filtered = filtered.filter(tender =>
        tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(tender => tender.status === statusFilter);
    }

    setFilteredTenders(filtered);
  }, [tenders, searchTerm, statusFilter]);

  // Fetch user's tenders from backend
  const fetchMyTenders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken'); // Adjust based on your auth system
      const response = await fetch(`${API_BASE_URL}/tenders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tenders');
      }

      const data = await response.json();
      setTenders(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tenders:', err);
    } finally {
      setLoading(false);
    }
  };

// Handle tender creation
  const handleCreateTender = () => {
  openModal('create'); // or navigate to a form page if you're using routing
};
   
  // Handle bid submission
  const handleSubmitBid = async (bidData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/bids`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bidData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit bid');
      }

      const result = await response.json();
      alert('Bid submitted successfully!');

      // Optionally refresh tenders or update UI
      // fetchMyTenders();

      return result;
    } catch (error) {
      console.error('Error submitting bid:', error);
      throw error;
    }
  };

  // Open bid dialog
  const openBidDialog = (tender) => {
    setBidTender(tender);
    setShowBidDialog(true);
  };

  // Close bid dialog
  const closeBidDialog = () => {
    setShowBidDialog(false);
    setBidTender(null);
  };

  // Handle form submission for create/update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      const url = modalType === 'create'
        ? `${API_BASE_URL}/tenders`
        : `${API_BASE_URL}/tenders/${selectedTender._id}`;

      const method = modalType === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${modalType} tender`);
      }

      const updatedTender = await response.json();

      if (modalType === 'create') {
        setTenders([...tenders, updatedTender]);
      } else {
        setTenders(tenders.map(tender =>
          tender._id === selectedTender._id ? updatedTender : tender
        ));
      }

      closeModal();
      alert(`Tender ${modalType === 'create' ? 'created' : 'updated'} successfully!`);
    } catch (err) {
      alert(`Error ${modalType === 'create' ? 'creating' : 'updating'} tender: ${err.message}`);
    }
  };

  // Handle tender deletion
  const handleDelete = async (tenderId) => {
    if (!window.confirm('Are you sure you want to delete this tender?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/tenders/${tenderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete tender');
      }

      setTenders(tenders.filter(tender => tender._id !== tenderId));
      alert('Tender deleted successfully!');
    } catch (err) {
      alert(`Error deleting tender: ${err.message}`);
    }
  };

  // Open modal for different actions
  const openModal = (type, tender = null) => {
    setModalType(type);
    setSelectedTender(tender);

    if (type === 'create') {
      setFormData({
        title: '',
        description: '',
        category: '',
        budget: '',
        deadline: '',
        requirements: '',
        contactEmail: '',
        contactPhone: '',
        location: '',
        status: 'draft'
      });
    } else if (type === 'edit' && tender) {
      setFormData({
        title: tender.title || '',
        description: tender.description || '',
        category: tender.category || '',
        budget: tender.budget || '',
        deadline: tender.deadline ? tender.deadline.split('T')[0] : '',
        requirements: tender.requirements || '',
        contactEmail: tender.contactEmail || '',
        contactPhone: tender.contactPhone || '',
        location: tender.location || '',
        status: tender.status || 'draft'
      });
    }

    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedTender(null);
    setModalType('create');
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { icon: Edit3, color: 'bg-gray-100 text-gray-800', text: 'Draft' },
      published: { icon: CheckCircle, color: 'bg-green-100 text-green-800', text: 'Published' },
      closed: { icon: XCircle, color: 'bg-red-100 text-red-800', text: 'Closed' },
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', text: 'Pending' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Tenders</h1>
              <p className="text-gray-600 mt-1">Manage your tender submissions and track their progress</p>
            </div>

            {user?.role === 'organization' && (
              <button
                onClick={handleCreateTender}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                + Create New Tender
              </button>
            )}


          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tenders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Tenders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenders.map((tender) => (
            <div key={tender._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{tender.title}</h3>
                  {getStatusBadge(tender.status)}
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{tender.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Building className="w-4 h-4 mr-2" />
                    {tender.category}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {formatCurrency(tender.budget)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    Deadline: {formatDate(tender.deadline)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal('view', tender)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md flex items-center justify-center gap-1 text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => openModal('edit', tender)}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded-md flex items-center justify-center gap-1 text-sm transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tender._id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-md flex items-center justify-center gap-1 text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>

                {/* Place Bid Button - Only show for published tenders */}
                {user?.role === 'bidder' && tender.status === 'published' && (
                  <button
                    onClick={() => openBidDialog(tender)}
                    className="w-full mt-3 bg-green-100 hover:bg-green-200 text-green-700 py-2 px-3 rounded-md flex items-center justify-center gap-1 text-sm transition-colors"
                  >
                    <DollarSign className="w-4 h-4" />
                    Place Bid
                  </button>
                )}
                {tender.status === 'closed' && (
                  <div className="mt-3 text-sm text-gray-500">
                    <Clock className="inline-block w-4 h-4 mr-1" />
                    Tender is closed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTenders.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tenders found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first tender'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => openModal('create')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Your First Tender
              </button>
            )}
          </div>
        )}

        {/* Modal for Create/Edit/View */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {modalType === 'create' && 'Create New Tender'}
                    {modalType === 'edit' && 'Edit Tender'}
                    {modalType === 'view' && 'Tender Details'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                {modalType === 'view' && selectedTender ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Title</h3>
                      <p className="text-gray-700">{selectedTender.title}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-700">{selectedTender.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
                        <p className="text-gray-700">{selectedTender.category}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Budget</h3>
                        <p className="text-gray-700">{formatCurrency(selectedTender.budget)}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Deadline</h3>
                        <p className="text-gray-700">{formatDate(selectedTender.deadline)}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
                        {getStatusBadge(selectedTender.status)}
                      </div>
                    </div>
                    {selectedTender.requirements && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                        <p className="text-gray-700">{selectedTender.requirements}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tender Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter tender title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe your tender requirements"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Category</option>
                          <option value="Construction">Construction</option>
                          <option value="IT Services">IT Services</option>
                          <option value="Consulting">Consulting</option>
                          <option value="Supply Chain">Supply Chain</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Budget *
                        </label>
                        <input
                          type="number"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Deadline *
                        </label>
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleInputChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="pending">Pending</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Requirements
                      </label>
                      <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Specific requirements and qualifications"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="contact@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="City, State/Region, Country"
                      />
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {modalType === 'create' ? 'Create Tender' : 'Update Tender'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bid Dialog */}
        <BidDialog
          isOpen={showBidDialog}
          onClose={closeBidDialog}
          tender={bidTender}
          onSubmitBid={handleSubmitBid}
        />
      </div>
    </div>
  );
};

export default MyTenders;