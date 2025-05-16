import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../../firebase/AuthContext';
import Login from '../pages/login';
import Signup from '../pages/signup';
import MainAppStack from './MainAppStack'; // 👈 New file you'll create

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, authInitializing } = useContext(AuthContext);

  if (authInitializing) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="MainApp" component={MainAppStack} /> // 👈 Will include DetailScreen inside
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
        </>
      )}
    </Stack.Navigator>
  );
}
