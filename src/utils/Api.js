import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { API_BASE_URL } from '@env';

// Flag supaya logout hanya sekali
let isLogoutTriggered = false;

const Api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});
/* ================= REQUEST INTERCEPTOR ================= */
Api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    /**
     * ⚠️ PENTING:
     * - JANGAN set Content-Type manual untuk FormData
     * - Axios akan set boundary sendiri
     */
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    } else {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  error => Promise.reject(error),
);

/* ================= RESPONSE INTERCEPTOR ================= */
Api.interceptors.response.use(
  response => response,
  async error => {
    const status = error.response?.status;
    const statusMessage = error.response?.data?.status;
    const apiMessage = error.response?.data?.message;

    // ❌ Login salah → jangan logout
    if (
      status === 401 &&
      (statusMessage === 'Invalid username or password' ||
        apiMessage === 'Invalid username or password')
    ) {
      return Promise.reject(error);
    }

    // 🔐 Token expired
    if (
      status === 401 &&
      (statusMessage === 'Token expired, Login ulang' ||
        apiMessage === 'Token expired, Login ulang')
    ) {
      if (!isLogoutTriggered) {
        isLogoutTriggered = true;
        Alert.alert(
          'Sesi Berakhir',
          'Sesi Anda telah berakhir. Silakan login ulang.',
          [
            {
              text: 'OK',
              onPress: async () => {
                await AsyncStorage.clear();
                // TODO: sesuaikan dengan navigator kamu
                // resetTo('Login');
                isLogoutTriggered = false;
              },
            },
          ],
        );
      }
      return Promise.reject(error);
    }

    // 🚨 Login di device lain
    if (
      status === 401 &&
      (statusMessage === 'Session invalid or expired' ||
        apiMessage === 'Session invalid or expired')
    ) {
      if (!isLogoutTriggered) {
        isLogoutTriggered = true;
        Alert.alert(
          'Login di perangkat lain',
          'Anda login di perangkat lain. Silakan login kembali.',
          [
            {
              text: 'OK',
              onPress: async () => {
                await AsyncStorage.clear();
                // TODO: sesuaikan dengan navigator kamu
                // resetTo('Login');
                isLogoutTriggered = false;
              },
            },
          ],
        );
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default Api;
