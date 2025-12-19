import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/Home';
import AbsensiScreen from '../screens/Home';
import HistoriScreen from '../screens/Home';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();

  const absenBg = isDark ? '#ff5252' : '#d32f2f';
  const absenIcon = isDark ? '#000' : '#fff';
  const absenText = isDark ? '#fff' : '#000';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#000' : '#fff',
          borderTopColor: isDark ? '#222' : '#eee',
          height: 72 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: isDark ? '#ff5252' : '#d32f2f',
        tabBarInactiveTintColor: isDark ? '#888' : '#999',
        tabBarLabelStyle: { fontSize: 12, marginBottom: 4 },
        tabBarIcon: ({ color, focused }) => {
          // BERANDA
          if (route.name === 'Beranda') {
            return (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={22}
                color={color}
              />
            );
          }

          // ABSENSI (LEBIH BESAR & RAPI)
          if (route.name === 'Absensi') {
            return (
              <View style={{ alignItems: 'center', marginTop: -22 }}>
                <View
                  style={{
                    width: 68, // ⬅️ lebih besar
                    height: 68,
                    borderRadius: 34,
                    backgroundColor: absenBg,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons
                    name={focused ? 'finger-print' : 'finger-print-outline'}
                    size={34} // ⬅️ icon lebih besar
                    color={absenIcon}
                  />
                </View>

                <Text
                  style={{
                    marginTop: 2, // ⬅️ lebih rapat
                    fontSize: 10,
                    fontWeight: '600',
                    color: absenText,
                  }}
                >
                  Absen
                </Text>
              </View>
            );
          }

          // HISTORI
          if (route.name === 'Histori') {
            return (
              <Ionicons
                name={focused ? 'time' : 'time-outline'}
                size={22}
                color={color}
              />
            );
          }
        },
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />

      <Tab.Screen
        name="Absensi"
        component={AbsensiScreen}
        options={{ tabBarLabel: '' }}
      />

      <Tab.Screen name="Histori" component={HistoriScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
