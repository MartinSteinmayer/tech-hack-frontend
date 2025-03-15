import axios from 'axios';

// Create API client with base URL
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// API functions for Supplier Discovery
export const supplierApi = {
    getAll: (filters = {}) => api.get('/suppliers/', { params: filters }),
    getById: (id) => api.get(`/suppliers/${id}`),
    search: (criteria) => api.post('/suppliers/search', criteria),
    getRecommended: (category) => api.get('/suppliers/recommend', { params: { category } }),
};

// API functions for Negotiation Companion
export const negotiationApi = {
    generateDossier: (supplierData) => api.post('/negotiations/generate-dossier', supplierData),
    getStrategies: (params) => api.get('/negotiations/strategies', { params }),
    draftMessage: (messageData) => api.post('/negotiations/messages', messageData),
};

// API functions for Compliance Guardian
export const complianceApi = {
    analyzeDocument: (document) => {
        const formData = new FormData();
        formData.append('document', document);
        return api.post('/compliance/analyze-document', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    getRequirements: (params) => api.get('/compliance/requirements', { params }),
    verifyCompliance: (supplierData) => api.post('/compliance/verify', supplierData),
};

// API functions for Order Agent
export const orderApi = {
    createOrder: (orderData) => api.post('/orders/', orderData),
    getOrderById: (id) => api.get(`/orders/${id}`),
    updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
    getAllOrders: () => api.get('/orders/'),
};

export default api;
