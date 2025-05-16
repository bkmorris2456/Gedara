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
  const [homes, setHomes] = useState([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const homesQuery = query(
      collection(db, 'properties'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(homesQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHomes(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Template navigation={navigation}>
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <Text style={[styles.headers]}>Homes</Text>

        <ScrollView style={styles.properties} showsVerticalScrollIndicator={false}>
          {homes.map((home) => (
            <Card
              key={home.id}
              width={300}
              height={100}
              style={{ marginVertical: 10 }}
              onPress={() => navigation.navigate('DetailScreen', { parentId: home.id, parentType: 'property', title: home.propName })}
            >
              <Text style={styles.general_text}>{home.propName}</Text>
            </Card>
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
    width: '100%',
  },
  general_text: {
    color: '#fff',
    fontSize: 16,
  },
});