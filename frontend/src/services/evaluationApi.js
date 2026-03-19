//evaluationApi.js
import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
//const BASE = '/api';

// ── Auto-attach token to every request ──────────────────────────
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('Authtoken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// ── Bid Evaluation ───────────────────────────────────────────────
export const runEvaluation   = (tenderId, weights) =>
  axios.post(`${BASE}/evaluations/${tenderId}/evaluate`, { weights });

export const getEvalMatrix   = (tenderId) =>
  axios.get(`${BASE}/evaluations/${tenderId}/matrix`);

export const updateBidStatus = (evalId, status) =>
  axios.patch(`${BASE}/evaluations/${evalId}/status`, { status });


// ── Anomaly Detection ────────────────────────────────────────────
export const runAnomalyDetection = (tenderId) =>
  axios.post(`${BASE}/anomalies/${tenderId}/detect`);

export const getAnomalyFlags     = (tenderId) =>
  axios.get(`${BASE}/anomalies/${tenderId}/flags`);

export const reviewAnomalyFlag   = (flagId, status, reviewNote) =>
  axios.patch(`${BASE}/anomalies/flag/${flagId}/review`, { status, reviewNote });

// ── Recommendations ──────────────────────────────────────────────
export const getRecommendations = () =>
  axios.get(`${BASE}/recommendations`);

export const saveTender = (tenderId) =>
  axios.post(`${BASE}/recommendations/${tenderId}/save`);

export const dismissTender = (tenderId) =>
  axios.post(`${BASE}/recommendations/${tenderId}/dismiss`);
