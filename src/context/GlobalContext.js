import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import CustomSpinner from '../components/CustomSpinner';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // 🔹 Load user dari AsyncStorage (saat pertama kali app dijalankan)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (e) {
        console.log('Gagal memuat user:', e);
      }
    };
    loadUser();
  }, []);

  // 🔹 Simpan user ke AsyncStorage setiap kali berubah
  useEffect(() => {
    const saveUser = async () => {
      if (user) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
    };
    saveUser();
  }, [user]);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  const showToast = (message, message2, type) => {
    Toast.show({
      type,
      text1: message,
      text2: message2,
      position: 'top',
      visibilityTime: 2500,
    });
  };

  return (
    <GlobalContext.Provider
      value={{
        showLoading,
        hideLoading,
        showToast,
        user,
        setUser, // ⬅️ tambahkan ini supaya screen lain bisa mengupdate user
      }}
    >
      {children}

      {loading && (
        <View style={styles.loadingOverlay}>
          <CustomSpinner />
        </View>
      )}

      <Toast
        config={{
          success: props => (
            <BaseToast
              {...props}
              style={{ borderLeftColor: 'green' }}
              text1Style={{ fontSize: 15, fontWeight: 'bold' }}
              text2Style={{ fontSize: 13 }}
            />
          ),
          error: props => (
            <ErrorToast
              {...props}
              style={{ borderLeftColor: 'red' }}
              text1Style={{ fontSize: 15, fontWeight: 'bold' }}
              text2Style={{ fontSize: 13 }}
            />
          ),
          warning: props => (
            <BaseToast
              {...props}
              style={{ borderLeftColor: 'orange', borderLeftWidth: 6 }}
              text1Style={{ fontSize: 15, fontWeight: 'bold', color: 'orange' }}
              text2Style={{ fontSize: 13, color: 'orange' }}
            />
          ),
        }}
      />
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1000,
  },
});
