import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useColorScheme } from 'react-native';

import HomeScreen from '../screens/Home';
import AbsensiScreen from '../screens/Home';
import DataAbsensiScreen from '../screens/Home';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#000' : '#fff',
          borderTopColor: isDark ? '#222' : '#eee',
          height: 60,
        },
        tabBarActiveTintColor: '#d32f2f',
        tabBarInactiveTintColor: isDark ? '#888' : '#999',
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'Beranda') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Absensi') {
            iconName = focused ? 'finger-print' : 'finger-print-outline';
          } else if (route.name === 'DataAbsensi') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="Absensi" component={AbsensiScreen} />
      <Tab.Screen
        name="DataAbsensi"
        component={DataAbsensiScreen}
        options={{ title: 'Data Absensi' }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
