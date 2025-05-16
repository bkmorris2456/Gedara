import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { db } from '../../config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Template from './template';
import Card from '../components/card';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export default function DetailScreen({ navigation }) {
  const { colors } = theme;
  const route = useRoute();
  const { parentId, parentType, title } = route.params;
  const [children, setChildren] = useState([]);

  useEffect(() => {
    let coll = '';
    let field = '';

    if (parentType === 'property') {
      coll = 'rooms';
      field = 'propertyId';
    } else if (parentType === 'room') {
      coll = 'items';
      field = 'roomId';
    } else {
      return;
    }

    const q = query(collection(db, coll), where(field, '==', parentId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChildren(data);
    });

    return () => unsubscribe();
  }, [parentId, parentType]);

  return (
    <Template navigation={navigation}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <Text style={styles.headers}>{title}</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {children.map(child => (
            <Card
              key={child.id}
              width={300}
              height={100}
              style={{ marginVertical: 10 }}
              onPress={() => {
                if (parentType === 'property') {
                  navigation.push('DetailScreen', { parentId: child.id, parentType: 'room', title: child.roomName });
                }
              }}
              variant="light"
            >
              <Text style={styles.general_text}>{child.roomName || child.itemName}</Text>
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
  general_text: {
    color: '#fff',
    fontSize: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});