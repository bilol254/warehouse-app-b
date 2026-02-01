import axios from 'axios';
const API_URL = '/api';
const api = axios.create({
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
    register: (name, username, password, role) => api.post('/auth/register', { name, username, password, role }),
    login: (username, password) => api.post('/auth/login', { username, password }),
    getMe: () => api.get('/auth/me')
};
export const productService = {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    search: (query) => api.get(`/products/search/${query}`)
};
export const purchaseService = {
    create: (data) => api.post('/purchases', data),
    getAll: () => api.get('/purchases'),
    getByProduct: (productId) => api.get(`/purchases/product/${productId}`)
};
export const saleService = {
    create: (data) => api.post('/sales', data),
    getAll: (filters) => api.get('/sales', { params: filters }),
    getById: (id) => api.get(`/sales/${id}`)
};
export const reportService = {
    getDashboard: () => api.get('/reports/dashboard'),
    getStockSummary: () => api.get('/reports/stock-summary'),
    getPeriodReport: (startDate, endDate) => api.get('/reports/period', { params: { start_date: startDate, end_date: endDate } })
};
export const userService = {
    getAll: () => api.get('/users'),
    create: (data) => api.post('/users', data),
    delete: (id) => api.delete(`/users/${id}`)
};
export const pricingService = {
    get: (productId) => api.get(`/pricing/${productId}`),
    update: (productId, data) => api.put(`/pricing/${productId}`, data)
};
export default api;
