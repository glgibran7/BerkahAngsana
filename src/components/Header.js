import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  useColorScheme,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useGlobal } from '../context/GlobalContext';

const { width } = Dimensions.get('window');

const capitalizeWords = (str = '') => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/* ================= UTIL ================= */
const getFirstName = (fullName = '') => {
  if (!fullName) return '';
  const first = fullName.trim().split(' ')[0];
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
};

const getFullName = (fullName = '') => {
  if (!fullName) return '';
  return fullName.trim();
};

const getInitial = (fullName = '') => {
  if (!fullName) return '';
  const words = fullName.trim().split(' ');
  if (words.length === 1) return words[0][0].toUpperCase();
  return words[0][0].toUpperCase() + words[1][0].toUpperCase();
};

/* === RANDOM COLOR (KONSISTEN PER USER) === */
const COLOR_POOL = [
  '#E53935',
  '#8E24AA',
  '#3949AB',
  '#1E88E5',
  '#00897B',
  '#43A047',
  '#F4511E',
  '#6D4C41',
];

const getColorFromName = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLOR_POOL[Math.abs(hash) % COLOR_POOL.length];
};

/* ================= HEADER ================= */
const Header = ({
  title,
  onBack,
  showBack = true,
  onNotificationPress,
  notificationCount = 5,
  showNotification = true,
}) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { user, setUser, showToast } = useGlobal();
  const [menuVisible, setMenuVisible] = useState(false);

  const firstName = getFirstName(user?.nama) || 'User';
  const fullName = getFullName(user?.nama) || 'User';
  const initialName = getInitial(user?.nama) || 'U';

  const profileColor = useMemo(
    () => getColorFromName(user?.nama || 'user'),
    [user?.nama],
  );

  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      setMenuVisible(false);

      // HAPUS DATA LOGIN
      await AsyncStorage.multiRemove(['token', 'user']);

      // RESET GLOBAL STATE
      setUser(null);

      showToast('Logout berhasil', 'Sampai jumpa', 'success');

      // RESET NAVIGATION → KEMBALI KE LOGIN
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={{ backgroundColor: isDark ? '#0E0E0E' : '#F6F6F6' }}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0E0E0E' : '#F6F6F6'}
      />

      <View style={styles.container}>
        {/* KIRI */}
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={styles.iconButton}>
              <Ionicons
                name="arrow-back"
                size={width * 0.075}
                color={isDark ? '#FFF' : '#000'}
              />
            </TouchableOpacity>
          )}

          <View style={{ marginLeft: 8 }}>
            <Text style={{ fontSize: 13, color: isDark ? '#aaa' : '#666' }}>
              Hai,
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: isDark ? '#fff' : '#000',
              }}
            >
              {capitalizeWords(user?.nama)}
            </Text>
          </View>
        </View>

        {/* KANAN */}
        <View style={styles.rightSection}>
          {showNotification && (
            <TouchableOpacity
              onPress={onNotificationPress}
              style={styles.iconButton}
            >
              <View>
                <Ionicons
                  name="notifications-outline"
                  size={width * 0.075}
                  color={isDark ? '#FFF' : '#000'}
                />
                {notificationCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{notificationCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}

          {/* PROFILE */}
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <View
              style={[styles.profileCircle, { backgroundColor: profileColor }]}
            >
              <Text style={styles.profileText}>{initialName}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== PROFILE MENU ===== */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={[
              styles.menuBox,
              { backgroundColor: isDark ? '#1A1A1A' : '#FFF' },
            ]}
          >
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="person-outline" size={20} color={profileColor} />
              <Text
                style={[styles.menuText, { color: isDark ? '#fff' : '#000' }]}
              >
                Profil
              </Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
              <Text style={[styles.menuText, { color: '#D32F2F' }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  profileText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  /* MENU */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 70,
    paddingRight: 16,
  },
  menuBox: {
    width: 160,
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 6,
    opacity: 0.2,
  },
});

export default Header;
