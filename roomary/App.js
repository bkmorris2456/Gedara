import React, { useEffect, useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import auth, { FirebaseAuthtypes } from '@react-native-firebase/auth';

// Import screens
import Home from './frontend/pages/home';
import Inventory from './frontend/pages/inventory';
import Settings from './frontend/pages/settings';

// Import modals
import HomeModal from './frontend/pages/modals/homeModal';
import RoomModal from './frontend/pages/modals/roomModal';
import ItemModal from './frontend/pages/modals/itemModal';
import { useSegments } from 'expo-router';
import { AuthProvider } from './firebase/AuthContext';
import RootNavigator from './frontend/components/RootNavigator';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [theme, setTheme] = useState(DarkTheme); // Force Dark Mode as default

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer theme={theme}>

          <RootNavigator/>

        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
