import React, { useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import Home from './frontend/pages/home';
import Inventory from './frontend/pages/inventory';
import Settings from './frontend/pages/settings';
import Login from './frontend/pages/login';
import HomeModal from './frontend/pages/creation-pages/homeModal';
import RoomModal from './frontend/pages/creation-pages/roomModal';
import ItemModal from './frontend/pages/creation-pages/itemModal';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Inventory') iconName = 'list-outline';
          else if (route.name === 'Settings') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="Inventory" component={Inventory} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [theme, setTheme] = useState(DarkTheme); // Force Dark Mode as default

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
       <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainApp" component={BottomTabs} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
