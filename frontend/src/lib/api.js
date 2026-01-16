import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', new URLSearchParams({ username: email, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }),

  register: (data) =>
    api.post('/auth/register', data),

  getProfile: () =>
    api.get('/auth/me'),
};

// Products API
export const productsAPI = {
  getAll: (params) =>
    api.get('/products/', { params }),

  getById: (id) =>
    api.get(`/products/${id}`),

  create: (data) =>
    api.post('/products/', data),

  update: (id, data) =>
    api.put(`/products/${id}`, data),

  delete: (id) =>
    api.delete(`/products/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () =>
    api.get('/products/categories/'),

  create: (data) =>
    api.post('/products/categories/', data),
};

// Orders API
export const ordersAPI = {
  createPaymentIntent: (data) =>
    api.post('/orders/create-payment-intent', data),

  create: (data) =>
    api.post('/orders/', data),

  getAll: () =>
    api.get('/orders/'),

  getById: (id) =>
    api.get(`/orders/${id}`),
};

// Admin API
export const adminAPI = {
  getDashboard: () =>
    api.get('/admin/dashboard'),

  getOrders: (params) =>
    api.get('/admin/orders', { params }),

  updateOrderStatus: (id, data) =>
    api.put(`/admin/orders/${id}/status`, data),

  getUsers: () =>
    api.get('/admin/users'),

  getLowStock: (threshold = 10) =>
    api.get('/admin/products/low-stock', { params: { threshold } }),
};

export default api;
