// frontend/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Base API service class
class BaseAPIService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async getAll(params = {}) {
    const response = await apiClient.get(`${this.endpoint}`, { params });
    return response.data;
  }

  async getById(id) {
    const response = await apiClient.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data) {
    const response = await apiClient.post(`${this.endpoint}`, data);
    return response.data;
  }

  async update(id, data) {
    const response = await apiClient.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id) {
    const response = await apiClient.delete(`${this.endpoint}/${id}`);
    return response.data;
  }
}

// Auth API
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  changePassword: (data) => apiClient.put('/auth/change-password', data)
};

// Specific API services
export const userAPI = new BaseAPIService('/users');
export const tenderAPI = new BaseAPIService('/tenders');
export const bidAPI = new BaseAPIService('/bids');
export const reportAPI = new BaseAPIService('/reports');

export default apiClient;