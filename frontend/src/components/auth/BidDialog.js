import React, { useState } from 'react';
import {
  X, DollarSign, Calendar, User, Phone, Mail, 
  Building, AlertCircle, CheckCircle, Clock
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';



const BidDialog = ({ 
  isOpen, 
  onClose, 
  tender, 
  onSubmitBid 
}) => {


  const user = useAuth().user; // Assuming user is available in AuthContext

  const [bidData, setBidData] = useState({
    amount: '',
    proposedTimeline: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    experience: '',
    proposal: '',
    portfolio: '',
    certifications: '',
    teamSize: '',
    methodology: '',
    userId: user.id,
    proposalDocument: 'https://example.com/proposal/BID-20250730-0001.pdf'
    
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form: 1 = Basic Info, 2 = Proposal Details, 3 = Company Info

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBidData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    // Step 1 validation
    if (step === 1) {
      if (!bidData.amount || bidData.amount <= 0) {
        newErrors.amount = 'Please enter a valid bid amount';
      }
      if (!bidData.proposedTimeline) {
        newErrors.proposedTimeline = 'Please specify your proposed timeline';
      }
      if (!bidData.companyName.trim()) {
        newErrors.companyName = 'Company name is required';
      }
      if (!bidData.contactPerson.trim()) {
        newErrors.contactPerson = 'Contact person is required';
      }
      if (!bidData.email.trim() || !/\S+@\S+\.\S+/.test(bidData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Step 2 validation
    if (step === 2) {
      if (!bidData.proposal.trim() || bidData.proposal.length < 50) {
        newErrors.proposal = 'Proposal must be at least 50 characters long';
      }
      if (!bidData.experience.trim()) {
        newErrors.experience = 'Please describe your relevant experience';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateForm()) {
      setStep(step + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setStep(step - 1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the parent component's submit handler
      await onSubmitBid({
        tenderId: tender.id,
        // userId: user.id,
      
        ...bidData,
        submittedAt: new Date().toISOString()
      });

      // Reset form
      setBidData({
        amount: '',
        proposedTimeline: '',
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        experience: '',
        proposal: '',
        portfolio: '',
        certifications: '',
        teamSize: '',
        methodology: ''
      });
      setStep(1);
      onClose();
    } catch (error) {
      console.error('Error submitting bid:', error);
      alert('Error submitting bid. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

  if (!isOpen || !tender) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Place Your Bid</h2>
              <p className="text-gray-600 mt-1">Submit your proposal for this tender opportunity</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tender Summary */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">{tender.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center text-blue-700">
                <DollarSign className="w-4 h-4 mr-2" />
                Budget: {formatCurrency(tender.budget)}
              </div>
              <div className="flex items-center text-blue-700">
                <Calendar className="w-4 h-4 mr-2" />
                Deadline: {formatDate(tender.deadline)}
              </div>
              <div className="flex items-center text-blue-700">
                <Building className="w-4 h-4 mr-2" />
                Category: {tender.category}
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step >= stepNumber 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {step > stepNumber ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-12 h-0.5 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bid Amount * <span className="text-xs text-gray-500">(USD)</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="amount"
                        value={bidData.amount}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.amount ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your bid amount"
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.amount}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proposed Timeline *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="proposedTimeline"
                        value={bidData.proposedTimeline}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.proposedTimeline ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 4-6 weeks, 3 months"
                      />
                    </div>
                    {errors.proposedTimeline && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.proposedTimeline}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="companyName"
                        value={bidData.companyName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.companyName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Your company name"
                      />
                    </div>
                    {errors.companyName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="contactPerson"
                        value={bidData.contactPerson}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.contactPerson ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Primary contact person"
                      />
                    </div>
                    {errors.contactPerson && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.contactPerson}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={bidData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="contact@yourcompany.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={bidData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Proposal Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Proposal Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Proposal * <span className="text-xs text-gray-500">(Min. 50 characters)</span>
                  </label>
                  <textarea
                    name="proposal"
                    value={bidData.proposal}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.proposal ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Describe your approach, methodology, and how you plan to deliver this project..."
                  />
                  <div className="flex justify-between mt-1">
                    {errors.proposal && (
                      <p className="text-red-500 text-xs flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.proposal}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 ml-auto">
                      {bidData.proposal.length} characters
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relevant Experience *
                  </label>
                  <textarea
                    name="experience"
                    value={bidData.experience}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.experience ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Describe your relevant experience and past similar projects..."
                  />
                  {errors.experience && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.experience}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Methodology & Approach
                  </label>
                  <textarea
                    name="methodology"
                    value={bidData.methodology}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Explain your methodology and approach to this project..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Company Information */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Size
                    </label>
                    <input
                      type="number"
                      name="teamSize"
                      value={bidData.teamSize}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Number of team members"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio/Website
                    </label>
                    <input
                      type="url"
                      name="portfolio"
                      value={bidData.portfolio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certifications & Qualifications
                  </label>
                  <textarea
                    name="certifications"
                    value={bidData.certifications}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List your relevant certifications, licenses, and qualifications..."
                  />
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Bid Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bid Amount:</span>
                      <span className="font-medium">{formatCurrency(bidData.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timeline:</span>
                      <span className="font-medium">{bidData.proposedTimeline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Company:</span>
                      <span className="font-medium">{bidData.companyName}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Submit Bid
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidDialog;