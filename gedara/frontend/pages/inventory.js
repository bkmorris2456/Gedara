import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Template from '../pages/template';
import Card from '../components/card';

export default function Inventory({ navigation }) {
  return (
        <Template navigation={navigation}>
       
        <View style={styles.container}>

          <Text style={[styles.headers]}>Main Home</Text>

          <Card width={325} height={100}>

          </Card> 

          <Text style={[styles.headers]}>Homes</Text>

          <ScrollView style={[styles.properties]}>
            <Card width={325} height={100} style={{ marginRight: 10 }}>
              Property 1
            </Card>
            <Card width={325} height={100} style={{ marginRight: 10 }}>
              Property 1
            </Card>
            <Card width={325} height={100} style={{ marginRight: 10 }}>
              Property 1
            </Card>
          </ScrollView>

        </View>

        </Template>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headers: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#fff",
  },
  properties: {
    flexGrow: 1,
    maxHeight: 200,
    marginVertical: 10,
    flexDirection: 'column',
    width: '100%',
  },
  cards: {
    marginVertical: 10,
  }
});
