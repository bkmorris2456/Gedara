import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Import pages
import Home from '../pages/home';
import Inventory from '../pages/inventory';
import Settings from '../pages/settings';
import EditElement from '../pages/EditElement'; // ✅ Import edit screen

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const InventoryStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

// Wrap Home tab in a stack so EditElement can live there
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="EditElement" component={EditElement} />
    </HomeStack.Navigator>
  );
}

function InventoryStackScreen() {
  return (
    <InventoryStack.Navigator screenOptions={{ headerShown: false }}>
      <InventoryStack.Screen name="Inventory" component={Inventory} />
      <InventoryStack.Screen name="EditElement" component={EditElement} />
    </InventoryStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="Settings" component={Settings} />
    </SettingsStack.Navigator>
  );
}

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') iconName = 'home-outline';
          else if (route.name === 'InventoryTab') iconName = 'list-outline';
          else if (route.name === 'SettingsTab') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="InventoryTab" component={InventoryStackScreen} options={{ title: 'Inventory' }} />
      <Tab.Screen name="SettingsTab" component={SettingsStackScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}
