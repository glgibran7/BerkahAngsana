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

const { width } = Dimensions.get('window');

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

  return (
    <SafeAreaView
      edges={['top']}
      style={{ backgroundColor: isDark ? '#000' : '#FFF' }}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#000' : '#FFF'}
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

          {showLocation ? (
            <TouchableOpacity
              onPress={onLocationPress}
              style={styles.locationWrapper}
            >
              <Text
                style={[
                  styles.locationLabel,
                  { color: isDark ? '#aaa' : '#666' },
                ]}
              >
                Lokasi
              </Text>
              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={width * 0.06}
                  color={isDark ? '#FFF' : '#000'}
                />
                <Text
                  style={[
                    styles.locationText,
                    { color: isDark ? '#FFF' : '#000' },
                  ]}
                >
                  {location}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={width * 0.05}
                  color={isDark ? '#FFF' : '#000'}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>
              {title}
            </Text>
          )}
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
});

export default Header;
