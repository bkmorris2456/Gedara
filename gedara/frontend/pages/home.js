import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Template from '../pages/template';
import Card from '../components/card';
import { Provider as PaperProvider, Text, Surface } from 'react-native-paper';
import { theme } from '../theme';

export default function Home({ navigation }) {

  const { colors } = theme;

  return (
    <Template navigation={navigation}>

      <View style={[styles.container, { backgroundColor: colors.primary }]}>

        <Text style={[styles.headers]}>My Properties</Text>

        <ScrollView style={[styles.properties]} horizontal={true} showsHorizontalScrollIndicator={false}>
          <Card width={200} height={125} style={{ marginRight: 10 }}>
            Property 1, last test before going abck to work
          </Card>
          <Card width={200} height={125} style={{ marginRight: 10 }}>
            Property 2
          </Card>
          <Card width={200} height={125} style={{ marginRight: 10 }}>
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
    marginVertical: 15,
    flexGrow: 1,
    maxHeight: 200, // Limit height for the properties section
  },
  recent: {
    marginVertical: 15,
    flexGrow: 1,
    maxHeight: 215, // Limit height for the recent properties section
    overflow: 'hidden', // Hide overflow to prevent scrollbars
  },
  summaries: {
    flexDirection: 'row',
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  }

});