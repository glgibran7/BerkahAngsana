import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  Text,
  useColorScheme,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomSpinner from '../components/CustomSpinner';

import logoLight from '../image/logo_berkah_large.png';
import logoDark from '../image/logo_white.png';

const { width } = Dimensions.get('window');
const LOGO_WIDTH = width * 0.65;

const SplashScreen = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }, 2000);
      } catch (error) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    };

    checkLogin();
  }, [navigation]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#0E0E0E' : '#FFFFFF' },
      ]}
    >
      <StatusBar hidden barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* LOGO */}
      <Image
        source={isDark ? logoDark : logoLight}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* APP NAME */}
      <Text style={[styles.appName, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
        Berkah Angsana
      </Text>

      <CustomSpinner />
    </View>
  );
};

export default SplashScreen;

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: LOGO_WIDTH,
    height: LOGO_WIDTH * 0.5,
    marginBottom: 20,
  },

  appName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
});
