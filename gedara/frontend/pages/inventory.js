import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Template from '../pages/template';
import Card from '../components/card';
import { Text } from 'react-native-paper';
import { theme } from '../theme';
import { auth, db } from '../../config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

// Inventory Screen 
export default function Inventory({ navigation }) {
  const { colors } = theme;
  const [properties, setProperties] = useState([]); // State to hold user property data

  // Fetch user's properties from Firestore in real-time
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    // Query to find properties that only belong to logged in user
    const propertiesQuery = query(
      collection(db, 'properties'),
      where('userId', '==', userId)
    );

    // Real-time Firestore listener
    const unsubscribe = onSnapshot(propertiesQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(data); // Update state with fetched properties
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Render Inventory Screen
  return (
    <Template navigation={navigation}>
      <View style={[styles.container, { backgroundColor: colors.primary }]}>

        <Text style={[styles.headers]}>Properties</Text>

        {/* Scrollable list of all user-owned properties */}
        <ScrollView style={styles.properties} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20, gap: 15 }}>
          {properties.map((property) => (
            <Card
              key={property.id}
              width={350}
              height={120}
              title={property.propName}
              type="Property"
              onPress={() => navigation.navigate('DetailScreen', {
                parentId: property.id,
                parentType: 'property',
                title: property.propName,
              })}
              onEdit={() => console.log(`Edit Property ${property.id}`)}
            />
          ))}
        </ScrollView>
      </View>
    </Template>
  );
}

// Inventory Screen and component styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headers: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#fff',
  },
  properties: {
    flexGrow: 1,
    maxHeight: '100%',
    width: '100%'
  },
  general_text: {
    color: '#fff',
    fontSize: 16,
  },
});
