// src/services/api.js
import axios from 'axios';
// import dotenv from 'dotenv';
// dotenv.config();
const API_BASE_URL ='http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (studentId, password) => axios.post('/auth/login', { studentId, password }),
  register: (studentId, password) => api.post('/auth/register', { studentId, password }),
};

export const candidatesAPI = {
  getAll: () => api.get('/candidates'),
  getById: (id) => api.get(`/candidates/${id}`),
};

export const votesAPI = {
  submit: (candidateId) => api.post('/votes', { candidateId }),
  getResults: () => api.get('/votes/results'),
};

export const adminAPI = {
  createCandidate: (candidateData) => api.post('/admin/candidates', candidateData),
  updateCandidate: (id, candidateData) => api.put(`/admin/candidates/${id}`, candidateData),
  deleteCandidate: (id) => api.delete(`/admin/candidates/${id}`),
  getElectionSettings: () => api.get('/admin/election'),
  updateElectionSettings: (settings) => api.put('/admin/election', settings),
};

export default api;