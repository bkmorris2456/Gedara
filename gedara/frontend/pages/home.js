import React from 'react';
import { View, Text } from 'react-native';
import Template from '../pages/template';
import Card from '../components/card';

export default function Home({ navigation }) {
  return (
    <Template navigation={navigation}>

      <Card width="100%" height={200}>
        <View width="100%" style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Card width="47%" height={100} variant="light">
            <Text>Child Card Component</Text>
          </Card>
          <Card width="47%" height={100} variant="light">
            <Text>Child Card Component</Text>
          </Card>
        </View>
      </Card>
    </Template>
  );
}
