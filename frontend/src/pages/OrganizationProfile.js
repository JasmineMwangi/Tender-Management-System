// pages/OrganizationProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Mail, Phone, Building2, MapPin, CreditCard, Globe, Users, TrendingUp, Award } from 'lucide-react';

const OrganizationProfile = () => {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [logoPreview, setLogoPreview] = useState(null);
  
  const [profile, setProfile] = useState({
    organizationName: '',
    organizationType: 'private',
    registrationNumber: '',
    taxId: '',
    email: '',
    phone: '',
    alternatePhone: '',
    logo: '',
    website: '',
    description: '',
    industry: '',
    foundedYear: '',
    numberOfEmployees: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    contactPersonFirstName: '',
    contactPersonLastName: '',
    contactPersonTitle: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    bankName: '',
    bankAccountNumber: '',
    bankRoutingNumber: '',
    verificationStatus: 'pending',
    totalTendersPosted: 0,
    activeTenders: 0,
    completedTenders: 0,
    rating: 0
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/profiles/organization', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 404) {
        setEditing(true);
      } else {
        setMessage({ type: 'error', text: 'Error loading profile' });
      }
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      
      const formData = new FormData();
      formData.append('logo', file);

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:5000/api/profiles/organization/upload-logo',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setProfile(prev => ({ ...prev, logo: response.data.logoUrl }));
        setMessage({ type: 'success', text: 'Logo uploaded successfully' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Error uploading logo' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = 'http://localhost:5000/api/profiles/organization';
      const method = profile.id ? 'put' : 'post';
      
      const response = await axios[method](url, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(response.data);
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile saved successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error saving profile' });
    } finally {
      setLoading(false);
    }
  };

  const getVerificationBadge = () => {
    const statusConfig = {
      verified: { bg: 'bg-green-100', text: 'text-green-800', label: 'Verified' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
    };
    const config = statusConfig[profile.verificationStatus] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Organization Profile</h1>
              <div className="mt-2">{getVerificationBadge()}</div>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 
            'bg-red-50 text-red-800 border-l-4 border-red-500'
          }`}>
            {message.text}
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Logo Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    {(logoPreview || profile.logo) ? (
                      <img 
                        src={logoPreview || `http://localhost:5000${profile.logo}`} 
                        alt="Organization Logo" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{profile.organizationName?.substring(0, 2).toUpperCase() || 'ORG'}</span>
                    )}
                  </div>
                  {editing && (
                    <label className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer hover:bg-indigo-700 transition-colors">
                      <Camera className="w-5 h-5 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 text-center">
                  {profile.organizationName || 'Organization Name'}
                </h2>
                <p className="text-gray-600 capitalize">{profile.organizationType}</p>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Award className="w-4 h-4 mr-2 text-yellow-500" />
                    Rating
                  </span>
                  <span className="font-semibold text-gray-900">
                    {profile.rating ? `${profile.rating}/5.0` : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                    Total Tenders
                  </span>
                  <span className="font-semibold text-gray-900">{profile.totalTendersPosted}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Building2 className="w-4 h-4 mr-2 text-green-500" />
                    Active
                  </span>
                  <span className="font-semibold text-gray-900">{profile.activeTenders}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-purple-500" />
                    Completed
                  </span>
                  <span className="font-semibold text-gray-900">{profile.completedTenders}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                  Organization Information
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
                    <input
                      type="text"
                      name="organizationName"
                      value={profile.organizationName}
                      onChange={handleChange}
                      disabled={!editing}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type *</label>
                      <select
                        name="organizationType"
                        value={profile.organizationType}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                      >
                        <option value="government">Government</option>
                        <option value="private">Private</option>
                        <option value="ngo">NGO</option>
                        <option value="public">Public</option>
                        <option value="semi-government">Semi-Government</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                      <input
                        type="text"
                        name="industry"
                        value={profile.industry}
                        onChange={handleChange}
                        disabled={!editing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number *</label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={profile.registrationNumber}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID *</label>
                      <input
                        type="text"
                        name="taxId"
                        value={profile.taxId}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
                      <input
                        type="number"
                        name="foundedYear"
                        value={profile.foundedYear}
                        onChange={handleChange}
                        disabled={!editing}
                        min="1800"
                        max={new Date().getFullYear()}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Employees</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          name="numberOfEmployees"
                          value={profile.numberOfEmployees}
                          onChange={handleChange}
                          disabled={!editing}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={profile.description}
                      onChange={handleChange}
                      disabled={!editing}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        name="website"
                        value={profile.website}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder="https://example.com"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alternate Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="alternatePhone"
                        value={profile.alternatePhone}
                        onChange={handleChange}
                        disabled={!editing}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                  Contact Person
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="contactPersonFirstName"
                      value={profile.contactPersonFirstName}
                      onChange={handleChange}
                      disabled={!editing}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="contactPersonLastName"
                      value={profile.contactPersonLastName}
                      onChange={handleChange}
                      disabled={!editing}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      name="contactPersonTitle"
                      value={profile.contactPersonTitle}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="e.g., CEO, Director"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="contactPersonEmail"
                        value={profile.contactPersonEmail}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="contactPersonPhone"
                        value={profile.contactPersonPhone}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Address
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      disabled={!editing}
                      rows="3"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={profile.city}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div> 

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={profile.state}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                      <input
                        type="text"
                        name="country"
                        value={profile.country}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={profile.postalCode}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Banking Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Banking Information
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={profile.bankName}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                      <input
                        type="text"
                        name="bankAccountNumber"
                        value={profile.bankAccountNumber}
                        onChange={handleChange}
                        disabled={!editing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number</label>
                      <input
                        type="text"
                        name="bankRoutingNumber"
                        value={profile.bankRoutingNumber}
                        onChange={handleChange}
                        disabled={!editing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              {editing && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      fetchProfile();
                    }}
                    className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfile;