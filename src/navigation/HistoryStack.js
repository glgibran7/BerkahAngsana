import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HistoryScreen from '../screens/HistoryScreen';
import RekapAbsensiScreen from '../screens/history/RekapAbsensiScreen';
import RekapIzinSakitScreen from '../screens/history/RekapIzinSakitScreen';
import RekapLemburScreen from '../screens/history/RekapLemburScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const HistoryStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Histori" component={HistoryScreen} />
      <Stack.Screen name="RekapAbsensi" component={RekapAbsensiScreen} />
      <Stack.Screen name="RekapIzinSakit" component={RekapIzinSakitScreen} />
      <Stack.Screen name="RekapLembur" component={RekapLemburScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default HistoryStack;
