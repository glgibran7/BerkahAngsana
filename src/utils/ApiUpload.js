import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';

const apiUpload = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    // ❗ jangan set Content-Type di sini
  },
});

// ✅ REQUEST INTERCEPTOR (ASYNC)
apiUpload.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

// RESPONSE DEBUG
apiUpload.interceptors.response.use(
  response => response,
  error => {
    console.log('UPLOAD ERROR:', error.response?.data || error.message);
    return Promise.reject(error);
  },
);

console.log('API BASE URL:', API_BASE_URL);

export default apiUpload;
