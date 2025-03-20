import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Template from '../pages/template';
import Card from '../components/card';
import { Provider as PaperProvider, Text, Surface } from 'react-native-paper';
import { theme } from '../theme';

export default function Inventory({ navigation }) {

  const { colors } = theme;

  return (
        <Template navigation={navigation}>
       
        <View style={[styles.container, { backgroundColor: colors.primary }]}>

          <Text style={[styles.headers]}>Main Home</Text>

          <Card width={300} height={100} style={{ marginBottom: 10 }}>
            Main Property
          </Card> 

          <Text style={[styles.headers]}>Homes</Text>

          <ScrollView style={[styles.properties]}>
            <Card width={300} height={100} style={{ marginVertical: 10 }}>
              Property 1
            </Card>
            <Card width={300} height={100} style={{ marginVertical: 10 }}>
              Property 2
            </Card>
            <Card width={300} height={100} style={{ marginVertical: 10 }}>
              Property 3
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
    maxHeight: "auto",
  },
  headers: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
    color: "#fff",
  },
  properties: {
    flexGrow: 1,
    maxHeight: 350,
    marginVertical: 10,
    flexDirection: 'column',
    width: '100%',
  },
  cards: {
    marginVertical: 10,
  }
});
