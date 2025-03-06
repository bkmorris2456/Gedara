import React from 'react';
import { View, Text } from 'react-native';
import Template from '../pages/template';
import Card from '../components/card';

export default function Signup({ navigation }) {
  return (
    <Template navigation={navigation}>
      <Card width="100%" height={200}>
        <Text>Signup Page</Text>
      </Card>
    </Template>
  );
}