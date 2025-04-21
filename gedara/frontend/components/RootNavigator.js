// navigation/RootNavigator.js
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../../firebase/AuthContext';
import Login from '../pages/login';
import Signup from '../pages/signup';
import BottomTabs from './BottomTabs'; // Assuming you have a BottomNav component for the main app

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, authInitializing } = useContext(AuthContext);

  if (authInitializing) {
    return null; // or a loading spinner
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Logged in
        <Stack.Screen name="MainApp" component={BottomTabs} />
      ) : (
        // Not logged in
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
        </>
      )}
    </Stack.Navigator>
  );
}
