import React from 'react';
import {
  View,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobal } from '../context/GlobalContext';
import Header from '../components/Header';

const HomeScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigation = useNavigation();

  const { setUser, showToast } = useGlobal();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // 🔹 hapus data login
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('user');

              // 🔹 reset user di context
              setUser(null);

              showToast('Logout berhasil', 'Sampai jumpa 👋', 'success');

              // 🔹 kembali ke login (reset stack)
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              showToast('Gagal logout', 'Terjadi kesalahan', 'error');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <>
      <Header
        title="Hi,"
        showLocation={false}
        showBack={false}
        showCart={true}
        showMessage={false}
        onNotificationPress={() => navigation.navigate('NotificationScreen')}
      />
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? '#000000' : '#FFFFFF' },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: isDark ? '#b00020' : '#d32f2f' },
          ]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
