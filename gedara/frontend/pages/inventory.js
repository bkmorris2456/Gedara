import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Template from '../pages/template';
import Card from '../components/card';
import { Text } from 'react-native-paper';
import { theme } from '../theme';
import { auth, db } from '../../config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function Inventory({ navigation }) {
  const { colors } = theme;
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const propertiesQuery = query(
      collection(db, 'properties'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(propertiesQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Template navigation={navigation}>
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <Text style={[styles.headers]}>Properties</Text>

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
              onDelete={() => console.log(`Delete Property ${property.id}`)}
            />
          ))}
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
    marginVertical: 15,
    color: '#fff',
  },
  properties: {
    flexGrow: 1,
    maxHeight: 350,
    width: '100%'
  },
  general_text: {
    color: '#fff',
    fontSize: 16,
  },
});
