// services/bidHistoryApi.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class BidHistoryAPI {
  // Get bid history for a user
  async getBidHistory(userId, filters = {}) {
    const params = new URLSearchParams();
    
    // Add filter parameters
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/bids/history/user/${userId}?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth system
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching bid history:', error);
      throw error;
    }
  }

  // Get bid history statistics
  async getBidHistoryStats(userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/bids/history/user/${userId}/stats`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching bid history stats:', error);
      throw error;
    }
  }

  // Get detailed bid information
  async getBidDetails(bidId, userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/bids/history/${bidId}/details?userId=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching bid details:', error);
      throw error;
    }
  }

  // Get bid timeline
  async getBidTimeline(bidId, userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/bids/history/${bidId}/timeline?userId=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching bid timeline:', error);
      throw error;
    }
  }

  // Withdraw a bid
  async withdrawBid(bidId, userId, reason) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/bids/history/${bidId}/withdraw`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            userId: userId,
            reason: reason
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error withdrawing bid:', error);
      throw error;
    }
  }

  // Export bid history
  async exportBidHistory(userId, format = 'csv') {
    try {
      const response = await fetch(
        `${API_BASE_URL}/bids/history/user/${userId}/export?format=${format}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bid-history-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Export completed successfully' };
    } catch (error) {
      console.error('Error exporting bid history:', error);
      throw error;
    }
  }
}

export default new BidHistoryAPI();