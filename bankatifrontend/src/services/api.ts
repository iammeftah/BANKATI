// api.ts
import axios from 'axios';

const API_URL = 'http://localhost:8091/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true // Add this
});