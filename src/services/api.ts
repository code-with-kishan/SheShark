/**
 * API Client Services
 * Reusable HTTP client for all API calls
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const hasToken = Boolean(localStorage.getItem('auth_token'));
    if (error.response?.status === 401 && hasToken) {
      // Invalid token, redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTHENTICATION ====================
export const authService = {
  register: (email: string, password: string, displayName: string, role: string) =>
    apiClient.post('/auth/register', { email, password, displayName, role }),

  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  demoLogin: (role: string) =>
    apiClient.post('/auth/demo-login', { role }),
};

// ==================== MARKETPLACE ====================
export const marketplaceService = {
  getProducts: (brand?: string, category?: string, searchQuery?: string) =>
    apiClient.get('/marketplace', { params: { brand, category, searchQuery } }),

  getProduct: (id: string) =>
    apiClient.get(`/marketplace/${id}`),

  createProduct: (product: any) =>
    apiClient.post('/marketplace', product),

  updateProduct: (id: string, data: any) =>
    apiClient.put(`/marketplace/${id}`, data),

  addReview: (productId: string, rating: number, comment: string) =>
    apiClient.post(`/marketplace/${productId}/reviews`, { rating, comment }),

  getReviews: (productId: string) =>
    apiClient.get(`/marketplace/${productId}/reviews`),

  getProductsByBrand: (brand: string) =>
    apiClient.get(`/marketplace/brand/${brand}`),

  getAllBrands: () =>
    apiClient.get('/brands'),

  uploadModelBase64: (fileName: string, data: string) =>
    apiClient.post('/marketplace/upload-model-base64', { fileName, data }),
};

// ==================== SAFETY ====================
export const safetyService = {
  triggerPanicAlert: (location: any, emergencyContacts: string[]) =>
    apiClient.post('/safety/panic', { location, emergencyContacts }),

  cancelPanicAlert: (alertId: string) =>
    apiClient.put(`/safety/panic/${alertId}`),

  getPanicAlerts: () =>
    apiClient.get('/safety/panic'),

  reportSafetyIssue: (type: string, description: string, location: any, isAnonymous: boolean) =>
    apiClient.post('/safety/report', { type, description, location, isAnonymous }),

  reportSafetyIssuePublic: (type: string, description: string, location: any, attachments: string[] = []) =>
    apiClient.post('/safety/report/public', {
      type,
      description,
      location,
      isAnonymous: true,
      attachments,
    }),

  getSafetyReports: () =>
    apiClient.get('/safety/report'),

  getSafetyReportsAdmin: () =>
    apiClient.get('/safety/report/admin'),

  rateRouteSafety: (from: string, to: string, safetyScore: number, comment?: string) =>
    apiClient.post('/safety/route-safety', { from, to, safetyScore, comment }),

  getRouteSafetyRatings: (from: string, to: string) =>
    apiClient.get('/safety/route-safety', { params: { from, to } }),

  suggestSaferRoute: (from: string, to: string) =>
    apiClient.get('/safety/route-safety/suggest', { params: { from, to } }),

  findNearestPoliceStation: (lat: number, lng: number) =>
    apiClient.get('/safety/police-stations', { params: { lat, lng } }),

  getEmergencyContacts: () =>
    apiClient.get('/safety/emergency-contacts'),

  updateEmergencyContacts: (emergencyContacts: string[]) =>
    apiClient.put('/safety/emergency-contacts', { emergencyContacts }),
};

// ==================== HEALTH ====================
export const healthService = {
  getHealthModules: (category?: string) =>
    apiClient.get('/health/modules', { params: { category } }),

  getHealthModule: (id: string) =>
    apiClient.get(`/health/modules/${id}`),

  recordMood: (mood: string, notes?: string) =>
    apiClient.post('/health/mood', { mood, notes }),

  getMoodHistory: (days?: number) =>
    apiClient.get('/health/mood-history', { params: { days } }),

  getMentalHealthResources: () =>
    apiClient.get('/health/mental-health-resources'),

  getMentalHealthSupport: (message: string, mood?: string) =>
    apiClient.post('/health/mental-health-support', { message, mood }),

  getChatHistory: (mode?: string) =>
    apiClient.get('/health/chat-history', { params: { mode } }),

  saveChatHistory: (mode: string, role: 'user' | 'model', text: string) =>
    apiClient.post('/health/chat-history', { mode, role, text }),

  clearChatHistory: (mode?: string) =>
    apiClient.delete('/health/chat-history', { params: { mode } }),
};

// ==================== SERVICES & BOOKINGS ====================
export const servicesService = {
  getServices: (category?: string, userId?: string) =>
    apiClient.get('/services', { params: { category, userId } }),

  getService: (id: string) =>
    apiClient.get(`/services/${id}`),

  createServiceListing: (service: any) =>
    apiClient.post('/services', service),

  updateServiceListing: (id: string, data: any) =>
    apiClient.put(`/services/${id}`, data),

  createBooking: (serviceId: string, startTime: string, endTime: string) =>
    apiClient.post(`/services/${serviceId}/book`, { startTime, endTime }),

  getBookings: () =>
    apiClient.get('/services/user/bookings'),

  getAvailableSlots: (serviceId: string, date: string) =>
    apiClient.get(`/services/${serviceId}/available-slots`, { params: { date } }),

  getEarnings: () =>
    apiClient.get('/services/user/earnings'),
};

// ==================== AI ====================
export const aiService = {
  chat: (message: string, mode?: string, language?: string) =>
    apiClient.post('/ai/chat', { message, mode, language }),

  processVoiceCommand: (transcript: string, language?: string) =>
    apiClient.post('/voice/command', { transcript, language }),
};

// ==================== HEALTH CHECK ====================
export const systemService = {
  getHealth: () =>
    apiClient.get('/health'),
};

export default apiClient;
