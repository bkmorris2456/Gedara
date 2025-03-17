import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Template from '../pages/template';
import Card from '../components/card';

export default function Home({ navigation }) {
  return (
    <Template navigation={navigation}>

      <View style={styles.container}>

        <Text style={[styles.headers]}>My Properties</Text>

        <ScrollView style={[styles.properties]} horizontal={true} showsHorizontalScrollIndicator={false}>
          <Card width={200} height={150} style={{ marginRight: 10 }}>
            Property 1
          </Card>
          <Card width={200} height={150} style={{ marginRight: 10 }}>
            Property 2
          </Card>
          <Card width={200} height={150} style={{ marginRight: 10 }}>
            Property 3
          </Card>
        </ScrollView>

        <Text style={[styles.headers]}>Recently Added</Text>

        <ScrollView style={styles.recent} horizontal={false} showsVerticalScrollIndicator={false}>
          <Card width={325} height={100} style={{ marginBottom: 10 }}>
            Recently Added Property 1
          </Card>
          <Card width={325} height={100} style={{ marginBottom: 10 }}>
            Recently Added Property 2
          </Card>
          <Card width={325} height={100} style={{ marginBottom: 10 }}>
            Recently Added Property 3
          </Card>
          <Card width={325} height={100} style={{ marginBottom: 10 }}>
            Recently Added Property 4
          </Card>
          <Card width={325} height={100} style={{ marginBottom: 10 }}>
            Recently Added Property 5
          </Card>
        </ScrollView>

        <Text style={[styles.headers]}>Inventory Value</Text>

        <View style={styles.summaries}>
          <Card width={100} height={100} style={{ marginRight: 10 }}>

          </Card>
          <Card width={100} height={100} style={{ marginRight: 10 }}>

          </Card>
          <Card width={100} height={100} style={{ marginRight: 10 }}>

          </Card>
        </View>

      </View>

    </Template>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  headers: { 
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    fontSize: 20,
    fontWeight: 'bold',
   }, // Default text color
  properties: {
    marginVertical: 10,
    flexGrow: 1,
    maxHeight: 175, // Limit height for the properties section
  },
  recent: {
    marginVertical: 10,
    flexGrow: 1,
    maxHeight: 215, // Limit height for the recent properties section
    overflow: 'hidden', // Hide overflow to prevent scrollbars
  },
  summaries: {
    flex: 1,
    flexDirection: 'row',
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
  }

});