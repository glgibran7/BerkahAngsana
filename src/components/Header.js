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

/* ================= UTIL ================= */
const capitalizeWords = (str = '') =>
  str
    .toLowerCase()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const getInitial = (fullName = '') => {
  if (!fullName) return 'U';
  const words = fullName.trim().split(' ');
  return words.length === 1
    ? words[0][0].toUpperCase()
    : words[0][0].toUpperCase() + words[1][0].toUpperCase();
};

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

const getColorFromName = name => {
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
  showGreeting = true,
  showNotification = true,
  showProfileInitial = true,
  notificationCount = 0,
  onNotificationPress,
}) => {
  const isDark = useColorScheme() === 'dark';
  const { user, setUser, showToast } = useGlobal();
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  /* ===== THEME ===== */
  const theme = {
    background: isDark ? '#0E0E0E' : '#F6F6F6',
    card: isDark ? '#1A1A1A' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#1E1E1E',
    textSecondary: isDark ? '#A0A0A0' : '#7A7A7A',
    divider: isDark ? '#2A2A2A' : '#E0E0E0',
    danger: '#D32F2F',
  };

  const profileColor = useMemo(
    () => getColorFromName(user?.nama || 'user'),
    [user?.nama],
  );

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    setUser(null);
    showToast('Logout berhasil', 'Sampai jumpa', 'success');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <View style={styles.container}>
        {/* ===== LEFT ===== */}
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={styles.iconButton}>
              <Ionicons
                name="arrow-back"
                size={width * 0.07}
                color={theme.textPrimary}
              />
            </TouchableOpacity>
          )}

          <View style={{ marginLeft: 8 }}>
            {showGreeting ? (
              <>
                <Text style={[styles.haiText, { color: theme.textSecondary }]}>
                  Hai,
                </Text>
                <Text style={[styles.nameText, { color: theme.textPrimary }]}>
                  {capitalizeWords(user?.nama)}
                </Text>
              </>
            ) : title ? (
              <Text style={[styles.titleText, { color: theme.textPrimary }]}>
                {title}
              </Text>
            ) : null}
          </View>
        </View>

        {/* ===== RIGHT ===== */}
        <View style={styles.rightSection}>
          {showNotification && (
            <TouchableOpacity onPress={onNotificationPress}>
              <Ionicons
                name="notifications-outline"
                size={width * 0.07}
                color={theme.textPrimary}
              />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {showProfileInitial && (
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <View
                style={[
                  styles.profileCircle,
                  { backgroundColor: profileColor },
                ]}
              >
                <Text style={styles.profileText}>{getInitial(user?.nama)}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ===== MENU ===== */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.menuBox, { backgroundColor: theme.card }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Profile');
              }}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={theme.textPrimary}
              />
              <Text style={[styles.menuText, { color: theme.textPrimary }]}>
                Profile
              </Text>
            </TouchableOpacity>

            <View
              style={[styles.menuDivider, { backgroundColor: theme.divider }]}
            />

            <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
              <Ionicons name="log-out-outline" size={20} color={theme.danger} />
              <Text style={[styles.menuText, { color: theme.danger }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default Header;

/* ================= STYLE (LAYOUT ONLY) ================= */
const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: { padding: 6 },

  haiText: { fontSize: 12 },
  nameText: { fontSize: 18, fontWeight: 'bold' },
  titleText: { fontSize: 18, fontWeight: 'bold' },

  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'flex-end',
    paddingTop: 70,
    paddingRight: 16,
  },
  menuBox: {
    width: 160,
    borderRadius: 12,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  menuText: { fontSize: 14 },
  menuDivider: { height: 1 },
});
