import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../../firebase/AuthContext'; // Context providing auth state
import Login from '../pages/login'; // Login screen component
import Signup from '../pages/signup'; // Signup screen component
import MainAppStack from './MainAppStack'; // Stack containing BottomTabs and DetailScreen
import EditElement from '../pages/EditElement'; // Edit Template Screen

// Create a native stack navigator instance
const Stack = createNativeStackNavigator();

// Root-level navigation component that determines which stack to show
export default function RootNavigator() {
  // Get authentication state and initialization status from context
  const { user, authInitializing } = useContext(AuthContext);

  // While Firebase is initializing, render nothing to avoid flickering
  if (authInitializing) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // If a user is authenticated, show the main app stack (bottom tabs + detail screen)
        <Stack.Screen name="MainApp" component={MainAppStack} />
      ) : (
        // If no user is signed in, show authentication screens
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
        </>
      )}
      <Stack.Screen name="EditElement" component={EditElement} />
    </Stack.Navigator>
  );
}
