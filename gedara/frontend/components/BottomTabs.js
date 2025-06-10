import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importing screen components to be used in the tabs
import Home from '../pages/home';
import Inventory from '../pages/inventory';
import Settings from '../pages/settings';

// Create a bottom tab navigator instance
const Tab = createBottomTabNavigator();

// Main component for bottom tab navigation
export default function BottomTabs() {
  return (
    <Tab.Navigator

      // Customizing tab screen options based on route
      screenOptions={({ route }) => ({

        // Define icons dynamically based on route name
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // Assign appropriate icon for each tab
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Inventory') iconName = 'list-outline';
          else if (route.name === 'Settings') iconName = 'person-outline';

          // Return Ionicons icon component with defined style
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Define each screen in the bottom tab bar */}
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="Inventory" component={Inventory} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
