import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { GlobalProvider } from './src/context/GlobalContext';

import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import BottomTabs from './src/navigation/BottomTabs';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GlobalProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />

          {/* INI YANG PENTING */}
          <Stack.Screen name="MainTabs" component={BottomTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProvider>
  );
}
