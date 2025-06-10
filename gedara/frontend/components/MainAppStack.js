// navigation/MainAppStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import DetailScreen from '../pages/DetailScreen';

// Create an instance of the native stack navigator
const Stack = createNativeStackNavigator();

// This component defines the main navigation stack of the app
export default function MainAppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Bottom tab navigator as the initial/main screen */}
      <Stack.Screen name="Tabs" component={BottomTabs} />

      {/* Detail screen that can be navigated to from anywhere in the app */}
      <Stack.Screen name="DetailScreen" component={DetailScreen} />
    </Stack.Navigator>
  );
}
