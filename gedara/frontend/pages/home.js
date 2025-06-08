import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import Template from '../pages/template';
import Card from '../components/card';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import { theme } from '../theme';
import { auth, db } from '../../config';
import {
  collection,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';

export default function Home({ navigation }) {
  const { colors } = theme;
  const [props, setProps] = useState([]);
  const [homes, setHomes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [items, setItems] = useState([]);
  const [recentEntries, setRecentEntries] = useState([]);

  // Real-time listeners for homes, rooms, and items
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const homesQuery = query(
      collection(db, 'properties'),
      where('userId', '==', userId)
    );
    const roomsQuery = query(
      collection(db, 'rooms'),
      where('userId', '==', userId)
    );
    const itemsQuery = query(
      collection(db, 'items'),
      where('userId', '==', userId)
    );

    const unsubHomes = onSnapshot(homesQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        type: 'Home',
      }));
      setHomes(data);
    });

    const unsubRooms = onSnapshot(roomsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        type: 'Room',
      }));
      setRooms(data);
    });

    const unsubItems = onSnapshot(itemsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        type: 'Item',
      }));
      setItems(data);
    });

    // Cleanup listeners
    return () => {
      unsubHomes();
      unsubRooms();
      unsubItems();
    };
  }, []);

  // Merge and sort all entries
  useEffect(() => {
    const all = [...homes, ...rooms, ...items];
    const sorted = all
      .filter(entry => entry.createdAt)
      .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
      .slice(0, 5);
    setRecentEntries(sorted);
  }, [homes, rooms, items]);

  const renderItem = ({ item }) => {
    let displayName = '';

    if (item.type === 'Home') {
      displayName = item.propName || 'Unnamed Property';
    } else if (item.type === 'Room') {
      displayName = item.roomName || 'Unnamed Room';
    } else if (item.type === 'Item') {
      displayName = item.itemName || 'Unnamed Item';
    }

    return (
      <Card width="80%" height={80} style={{ marginBottom: 10 }}>
        <View>
          <Text style={styles.entryType}>{item.type}</Text>
          <Text style={styles.entryName}>{displayName}</Text>
        </View>
      </Card>
    );
  };

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const userPropsRef = query(
      collection(db, 'properties'),
      where('userId', '==', userId)
    );

    const unsubProps = onSnapshot(userPropsRef, (snapshot) => {
      const propsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProps(propsList);
    });

    return () => unsubProps();
  }, []);

  return (
    <Template navigation={navigation}>
      <View style={[styles.container, { backgroundColor: colors.primary }]}>

        <Text style={[styles.headers]}>My Properties</Text>

        <ScrollView style={[styles.properties]} horizontal={true} showsHorizontalScrollIndicator={false}>
          {props.map((prop) => (
            <Card
              key={prop.id}
              width={180}
              height={125}
              style={{ marginRight: 10 }}
              onPress={() => navigation.navigate('DetailScreen', {
                parentId: prop.id,
                parentType: 'property',
                title: prop.propName,
              })}
            >
              <Text style={styles.general_text}>{prop.propName}</Text>
            </Card>
          ))}
        </ScrollView>

        <Text style={[styles.headers]}>Recently Added</Text>

        <View style={styles.recent}>
          <FlatList
            data={recentEntries}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={{ color: '#fff' }}>No recent entries</Text>}
          />
        </View>

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
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  properties: {
    marginTop: 5,
    flexGrow: 1,
    maxHeight: 125,
  },
  recent: {
    marginVertical: 5,
    flexGrow: 1,
    maxHeight: 325,
    overflow: 'hidden',
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
  },
  entryCard: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
  },
  entryType: {
    fontSize: 14,
    color: '#888',
  },
  entryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
