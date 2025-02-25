import React from 'react';
import { View, Text } from 'react-native';
import Template from '../pages/template';
import Card from '../components/card';

export default function Home({ navigation }) {
  return (
    <Template navigation={navigation}>
      <Text>Home Screen</Text>

      <Card width="100%" height={200}>
        <Text>Card Component</Text>
      </Card>
    </Template>
  );
}
