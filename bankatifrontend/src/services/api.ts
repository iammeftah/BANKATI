import axios from 'axios';

const AUTH_URL = 'http://localhost:8091/api';
const WALLET_URL = 'http://localhost:8092/api';



// Helper function to get token
const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : '';
};

export const api = axios.create({
    baseURL: AUTH_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

export const walletApi = axios.create({
    baseURL: WALLET_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

// Updated interceptors
[api, walletApi].forEach(api => {
    api.interceptors.request.use(
        (config) => {
            const token = getAuthToken();
            if (token) {
                config.headers.Authorization = token;
            }
            // Log the request configuration
            console.log('Request Config:', {
                url: config.url,
                method: config.method,
                headers: config.headers,
                data: config.data
            });
            return config;
        },
        (error) => {
            console.error('Request interceptor error:', error);
            return Promise.reject(error);
        }
    );

    // At the top of api.ts, after the api creation
    api.interceptors.response.use(
        (response) => {
            console.log('API Success Response:', {
                url: response.config.url,
                method: response.config.method,
                data: response.data,
                status: response.status
            });
            return response;
        },
        (error) => {
            console.error('API Error Response:', {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            return Promise.reject(error);
        }
    );
});


