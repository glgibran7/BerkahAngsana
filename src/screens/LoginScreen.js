import React, { useState, useEffect, useRef, use } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
  useColorScheme,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { useGlobal } from '../context/GlobalContext';
import Api from '../utils/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

import logo from '../image/logo_berkah_large.png';
import logoDark from '../image/logo_white.png';

const { width } = Dimensions.get('window');

const capitalizeName = (name = '') =>
  name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const LoginScreen = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { showToast, showLoading, hideLoading, setUser } = useGlobal();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // 🔹 Cek apakah ada data remember di storage
    const loadRememberedData = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem('remember_username');
        const savedPassword = await AsyncStorage.getItem('remember_password');
        const remember = await AsyncStorage.getItem('remember_me');

        if (remember === 'true' && savedUsername && savedPassword) {
          setUsername(savedUsername);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (err) {
        console.log('Error loading remembered data:', err);
      }
    };

    loadRememberedData();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      showToast(
        'Username atau password tidak boleh kosong!',
        'Masukkan username & password anda',
        'error',
      );
      return;
    }

    showLoading();

    try {
      const response = await Api.post('/auth/login/karyawan', {
        username,
        password,
      });

      console.log('Response login:', response.data);

      const data = response.data;

      if (data?.access_token) {
        // Simpan token dan id_karyawan ke AsyncStorage
        await AsyncStorage.setItem('token', data.access_token);
        await AsyncStorage.setItem('user', JSON.stringify(data));

        // Simpan id_karyawan secara terpisah juga jika perlu
        if (data.id_karyawan) {
          await AsyncStorage.setItem('id_karyawan', String(data.id_karyawan));
        }

        setUser(data);

        // Remember me
        if (rememberMe) {
          await AsyncStorage.setItem('remember_username', username);
          await AsyncStorage.setItem('remember_password', password);
          await AsyncStorage.setItem('remember_me', 'true');
        } else {
          await AsyncStorage.removeItem('remember_username');
          await AsyncStorage.removeItem('remember_password');
          await AsyncStorage.setItem('remember_me', 'false');
        }

        hideLoading();
        const namaCapitalize = capitalizeName(data.nama);

        showToast('Selamat datang kembali', `${namaCapitalize} 👋`, 'success');
        navigation.replace('MainTabs');
      } else {
        hideLoading();
        showToast('Login gagal', 'Token tidak ditemukan', 'error');
      }
    } catch (error) {
      hideLoading();
      showToast(
        'Username atau password salah!',
        'Periksa kembali username/password anda',
        'error',
      );
    }
  };

  const themeStyles = isDark ? darkStyles : lightStyles;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#121212' : '#FFFFFF'}
      />
      <ScrollView
        contentContainerStyle={[styles.container, themeStyles.container]}
      >
        <Animated.Image
          source={isDark ? logoDark : logo}
          style={[
            styles.logo,
            { opacity: fadeAnim, width: width * 0.9, height: width * 0.5 },
          ]}
          resizeMode="contain"
        />

        {/* Input username */}
        <TextInput
          style={[styles.input, themeStyles.input]}
          placeholder="Username"
          placeholderTextColor={isDark ? '#aaa' : '#555'}
          value={username}
          onChangeText={setUsername}
          keyboardType="default"
          autoCapitalize="none"
        />

        {/* Input Password */}
        <View style={[styles.passwordContainer, themeStyles.input]}>
          <TextInput
            style={[styles.passwordInput, { color: isDark ? '#fff' : '#000' }]}
            placeholder="Password"
            placeholderTextColor={isDark ? '#aaa' : '#555'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={22}
              color={isDark ? '#ccc' : '#555'}
            />
          </TouchableOpacity>
        </View>

        {/* Remember Me & Forgot Password */}
        <View style={styles.rememberMeContainer}>
          <CheckBox
            value={rememberMe}
            onValueChange={setRememberMe}
            tintColors={{ true: '#00BFFF', false: isDark ? '#aaa' : '#555' }}
          />
          <Text style={[styles.rememberMeText, themeStyles.text]}>
            Ingat Saya
          </Text>
          {/* <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity
              onPress={() =>
                showToast(
                  'Fitur belum tersedia 🚧',
                  'Lupa password belum aktif',
                  'warning', // atau "error", terserah kamu
                )
              }
            >
              <Text style={styles.forgotPasswordText}>Lupa Password?</Text>
            </TouchableOpacity>
          </View> */}
        </View>

        {/* Tombol Login */}
        <TouchableOpacity
          style={{ width: '100%' }}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#b00020', '#d32f2f']}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Register */}
        {/* <View style={styles.registerContainer}>
          <Text style={[styles.registerText, themeStyles.text]}>
            Belum punya akun?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('RegisterScreen')}
          >
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
  },
  eyeIcon: {
    padding: 5,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  rememberMeText: { fontSize: 16, marginLeft: 2 },
  forgotPasswordContainer: { flex: 1, alignItems: 'flex-end' },
  forgotPasswordText: { fontSize: 14, color: '#007BFF' },
  loginButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  loginButtonText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  registerText: { fontSize: 15 },
  registerLink: { fontSize: 15, color: '#007BFF', fontWeight: 'bold' },
});

/* Tema Terang */
const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  input: { borderColor: '#ddd', backgroundColor: '#f9f9f9', color: '#000' },
  text: { color: '#333' },
});

/* Tema Gelap */
const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#000' },
  input: { borderColor: '#444', backgroundColor: '#1e1e1e', color: '#fff' },
  text: { color: '#fff' },
});

export default LoginScreen;
