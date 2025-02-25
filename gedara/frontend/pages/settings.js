import React from 'react';
import { View, Text } from 'react-native';
import Template from '../pages/template';

export default function Settings({ navigation }) {
  return (
    <Template navigation={navigation}>
      <Text>Settings Screen</Text>
    </Template>
  );
}
