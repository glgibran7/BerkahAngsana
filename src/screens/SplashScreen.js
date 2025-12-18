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
import logo from '../image/logo_berkah_large.png';

const { width } = Dimensions.get('window');

const LOGO_SIZE = width * 0.55;

const SplashScreen = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
        { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' },
      ]}
    >
      <StatusBar hidden barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Logo bulat */}
      <View
        style={[
          styles.logoWrapper,
          { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
        ]}
      >
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Text nama */}
      <Text style={[styles.appName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
        Berkah Angsana
      </Text>

      <CustomSpinner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoWrapper: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  logo: {
    width: '70%',
    height: '70%',
  },

  appName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
