import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://saas-inventory-sales-management.vercel.app/api/movil',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

export default apiClient;