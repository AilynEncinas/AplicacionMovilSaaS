import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.1.3:3000/api', // Se debe ajustar según la IP de la computadora
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

export default apiClient;