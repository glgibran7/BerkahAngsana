import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useGlobal } from '../context/GlobalContext';

const { width } = Dimensions.get('window');

const getFirstName = (fullName = '') => {
  if (!fullName) return '';
  const first = fullName.trim().split(' ')[0];
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
};

const getInitial = (fullName = '') => {
  if (!fullName) return '';

  const words = fullName.trim().split(' ');

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
};

const Header = ({
  title,
  onBack,
  showBack = true,
  onLocationPress,
  onMessagePress,
  onNotificationPress,
  location = 'Mataram',
  messageCount = 99,
  notificationCount = 5,
  showLocation = true,
  showMessage = true,
  showNotification = true,
}) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { user } = useGlobal();

  const firstName = getFirstName(user?.nama) || 'User';
  const initialName = getInitial(user?.nama) || 'U';

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
        {/* Kiri: Back + Title / Lokasi */}
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={styles.iconButton}>
              <Ionicons
                name="arrow-back"
                size={width * 0.08}
                color={isDark ? '#FFF' : '#000'}
              />
            </TouchableOpacity>
          )}

          <View style={{ marginLeft: 8 }}>
            <Text
              style={{
                fontSize: 13,
                color: isDark ? '#aaa' : '#666',
              }}
            >
              Hai,
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: isDark ? '#fff' : '#000',
              }}
            >
              {firstName}
            </Text>
          </View>
        </View>

        {/* Kanan: Pesan + Notifikasi */}
        <View style={styles.rightSection}>
          {showNotification && (
            <TouchableOpacity
              onPress={onNotificationPress}
              style={styles.iconButton}
            >
              <View style={{ position: 'relative' }}>
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
          {showMessage && (
            <TouchableOpacity
              onPress={onMessagePress}
              style={styles.iconButton}
            >
              <View style={{ position: 'relative' }}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={width * 0.075}
                  color={isDark ? '#FFF' : '#000'}
                />
                {messageCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{messageCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
          {/* PROFILE INISIAL */}
          <TouchableOpacity onPress={() => {}} style={{ marginLeft: 8 }}>
            <View
              style={[
                styles.profileCircle,
                { backgroundColor: isDark ? '#1e1e1e' : '#e0e0e0' },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: isDark ? '#fff' : '#000',
                }}
              >
                {initialName}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  locationWrapper: {
    flexDirection: 'column',
    marginLeft: 8,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: -2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  iconButton: {
    padding: 8,
    marginLeft: 0,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
});

export default Header;
