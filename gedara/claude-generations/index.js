// src/navigation/index.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Auth screens
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';

// App screens
import HomesScreen from '../screens/Homes';
import HomeDetailsScreen from '../screens/HomeDetails';
import RoomDetailsScreen from '../screens/RoomDetails';
import ProfileScreen from '../screens/Profile';

// Auth context
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack navigator for authentication flow
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Tab navigator for main app flow
const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Homes') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4285F4',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Homes" component={HomesStackNavigator} options={{ headerShown: false }} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Stack navigator for Homes flow
const HomesStack = createStackNavigator();
const HomesStackNavigator = () => (
  <HomesStack.Navigator>
    <HomesStack.Screen name="My Homes" component={HomesScreen} />
    <HomesStack.Screen 
      name="HomeDetails" 
      component={HomeDetailsScreen} 
      options={({ route }) => ({ title: route.params?.homeName || 'Home Details' })}
    />
    <HomesStack.Screen 
      name="RoomDetails" 
      component={RoomDetailsScreen} 
      options={({ route }) => ({ title: route.params?.roomName || 'Room Details' })}
    />
  </HomesStack.Navigator>
);

// Root navigator that switches between Auth and App flows
export default function AppNavigation() {
  const { isLoggedIn, loading } = useAuth();

  // Show loading indicator while initializing auth state
  if (loading) {
    return null; // Or a splash screen component
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}