import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
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
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  verifyToken: () => api.get('/auth/verify'),
};

export const productsAPI = {
  getProducts: () => api.get('/products'),
  addProduct: (product: any) => {
    console.log('Sending product data:', product);
    return api.post('/products', product);
  },
  updateProduct: (id: string, product: any) => {
    console.log('Updating product:', product.id, product);
    return api.put(`/products/${id}`, product);
  },
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
};

export const modelsAPI = {
  getModels: () => api.get('/models'),
  addModel: (model: any) => {
    console.log('Sending model data:', model);
    return api.post('/models', model);
  },
  updateModel: (id: string, model: any) => api.put(`/models/${id}`, model),
  deleteModel: (id: string) => api.delete(`/models/${id}`),
};

export const batteriesAPI = {
  getBatteries: () => api.get('/batteries'),
  addBattery: (battery: any) => {
    console.log('Sending battery data:', battery);
    return api.post('/batteries', battery);
  },
  updateBattery: (id: string, battery: any) => api.put(`/batteries/${id}`, battery),
  deleteBattery: (id: string) => api.delete(`/batteries/${id}`),
};

export const receiptAPI = {
  generateReceipt: (receiptData: any) => api.post('/receipts', receiptData),
  getReceipts: () => api.get('/receipts'),
  getReceiptById: (id: string) => api.get(`/receipts/${id}`),
  searchReceipts: (filters: any) => api.post('/receipts/search', filters),
  updateReceipt: (id: string, receiptData: any) => api.put(`/receipts/${id}`, receiptData),
  deleteReceipt: (id: string) => api.delete(`/receipts/${id}`),
};

export default api;