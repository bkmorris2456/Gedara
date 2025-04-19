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
          <Card width={180} height={125} style={{ marginRight: 10 }}>
            <Text style={styles.general_text}>Property</Text>
          </Card>
          <Card width={180} height={125} style={{ marginRight: 10 }}>
            <Text style={styles.general_text}>Property</Text>
          </Card>
          <Card width={180} height={125} style={{ marginRight: 10 }}>
            <Text style={styles.general_text}>Property</Text>
          </Card>
        </ScrollView>

        <Text style={[styles.headers]}>Recently Added</Text>

        <ScrollView style={styles.recent} horizontal={false} showsVerticalScrollIndicator={false}>
          <Card width={325} height={100} style={{ marginBottom: 10 }}>
            <Text style={styles.general_text}>Property</Text>
          </Card>
          <Card width={325} height={100} style={{ marginBottom: 10 }}>
            <Text style={styles.general_text}>Property</Text>
          </Card>
          <Card width={325} height={100} style={{ marginBottom: 10 }}>
            <Text style={styles.general_text}>Property</Text>
          </Card>
          <Card width={325} height={100} style={{ marginBottom: 10 }}>
            <Text style={styles.general_text}>Property</Text>
          </Card>
          <Card width={325} height={100} style={{ marginBottom: 10 }}>
            <Text style={styles.general_text}>Property</Text>
          </Card>
        </ScrollView>

        <Text style={[styles.headers]}>Inventory Value</Text>

        <View style={styles.summaries}>
          <Card width={120} height={100} style={{ marginRight: 10 }}>
            <Text style={styles.general_text}>Total Items</Text>
          </Card>
          <Card width={120} height={100} style={{ marginRight: 10 }}>
            <Text style={styles.general_text}>Total Rooms</Text>
          </Card>
          <Card width={120} height={100} style={{ marginRight: 10 }}>
            <Text style={styles.general_text}>Total Value</Text>
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
    marginVertical: 15,
   }, // Default text color
  properties: {
    marginTop: 5,
    flexGrow: 1,
    maxHeight: 125, // Limit height for the properties section
  },
  recent: {
    marginVertical: 5,
    flexGrow: 1,
    maxHeight: 325, // Limit height for the recent properties section
    overflow: 'hidden', // Hide overflow to prevent scrollbars
  },
  summaries: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  general_text: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
  }

});