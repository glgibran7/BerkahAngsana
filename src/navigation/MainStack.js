import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/Home';
import IzinScreen from '../screens/main/IzinScreen';
import SakitScreen from '../screens/main/SakitScreen';
import CutiScreen from '../screens/CutiScreen';
import LemburScreen from '../screens/main/LemburScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Izin" component={IzinScreen} />
      <Stack.Screen name="Sakit" component={SakitScreen} />
      <Stack.Screen name="Cuti" component={CutiScreen} />
      <Stack.Screen name="Lembur" component={LemburScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
