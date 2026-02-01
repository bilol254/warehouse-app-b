import axios, { AxiosInstance } from 'axios';
import { User, Product, Purchase, Sale, PricingRule, DashboardStats } from '../types';

const API_URL = '/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (name: string, username: string, password: string, role: 'manager' | 'seller') =>
    api.post<{ user: User; token: string }>('/auth/register', { name, username, password, role }),
  login: (username: string, password: string) =>
    api.post<{ user: User; token: string }>('/auth/login', { username, password }),
  getMe: () => api.get<User>('/auth/me')
};

export const productService = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  create: (data: { name: string; sku?: string; category?: string; unit?: string }) =>
    api.post<{ id: number }>('/products', data),
  search: (query: string) => api.get<Product[]>(`/products/search/${query}`)
};

export const purchaseService = {
  create: (data: {
    product_id: number;
    qty_in: number;
    buy_price_per_unit: number;
    expense_total?: number;
    arrived_at?: string;
    note?: string;
  }) => api.post<{ id: number }>('/purchases', data),
  getAll: () => api.get<Purchase[]>('/purchases'),
  getByProduct: (productId: number) => api.get<Purchase[]>(`/purchases/product/${productId}`)
};

export const saleService = {
  create: (data: {
    items: Array<{
      product_id: number;
      qty: number;
      sell_price_per_unit: number;
    }>;
    customer_name?: string;
    payment_type?: string;
  }) =>
    api.post<Sale>('/sales', data),
  getAll: (filters?: { start_date?: string; end_date?: string; seller_id?: number }) =>
    api.get<Sale[]>('/sales', { params: filters }),
  getById: (id: number) => api.get<Sale>(`/sales/${id}`)
};

export const reportService = {
  getDashboard: () => api.get<DashboardStats>('/reports/dashboard'),
  getStockSummary: () => api.get<Product[]>('/reports/stock-summary'),
  getPeriodReport: (startDate: string, endDate: string) =>
    api.get('/reports/period', { params: { start_date: startDate, end_date: endDate } })
};

export const userService = {
  getAll: () => api.get<User[]>('/users'),
  create: (data: { name: string; username: string; password: string; role: 'manager' | 'seller' }) =>
    api.post<User>('/users', data),
  delete: (id: number) => api.delete(`/users/${id}`)
};

export const pricingService = {
  get: (productId: number) => api.get<PricingRule>(`/pricing/${productId}`),
  update: (productId: number, data: Partial<PricingRule>) =>
    api.put(`/pricing/${productId}`, data)
};

export default api;
