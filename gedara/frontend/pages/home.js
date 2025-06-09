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

// Main Home Screen
export default function Home({ navigation, triggerDelete }) {
  const { colors } = theme;

  // States for managing data
  const [props, setProps] = useState([]); // Raw list of user's properties (for My Properties section)

  // All user elements (properties, rooms, and items)
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [items, setItems] = useState([]);

  const [recentEntries, setRecentEntries] = useState([]); // Merged and sorted list of recent additions made by user

  // Fetch all elements created by the user
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const propertiesQuery = query(
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

    // Real-time listeners for properties, rooms, and items
    const unsubProperties = onSnapshot(propertiesQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        type: 'Property',
      }));
      setProperties(data);
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

    // Clean up the listeners on component unmount
    return () => {
      unsubProperties();
      unsubRooms();
      unsubItems();
    };
  }, []);

  // Merge and sort all entries by creation time for recent activity section
  useEffect(() => {
    const all = [...properties, ...rooms, ...items];
    const sorted = all
      .filter(entry => entry.createdAt) // Only entries with timestamps
      .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds) // Sorted by descending order
      .slice(0, 5); // Show only the 5 most recent
    setRecentEntries(sorted);
  }, [properties, rooms, items]);

  // Used in FlatList to render each item
  const renderItem = ({ item }) => {
    let displayName = '';
    let type = item.type;

    // Resolve a display name based on the type of element
    if (type === 'Property') {
      displayName = item.propName || 'Unnamed Property';
    } else if (type === 'Room') {
      displayName = item.roomName || 'Unnamed Room';
    } else if (type === 'Item') {
      displayName = item.itemName || 'Unnamed Item';
    }

    return (
      <Card
        width="90%"
        height={100}
        title={displayName}
        type={type}
        // Navigate to DetailScreen template to load up children elements depending on type of card pressed
        onPress={() => {
          if (type === 'Property') {
            navigation.navigate('DetailScreen', {
              parentId: item.id,
              parentType: 'property',
              title: displayName,
            });
          } else if (type === 'Room') {
            navigation.navigate('DetailScreen', {
              parentId: item.id,
              parentType: 'room',
              title: displayName,
            });
          }
        }}
        onEdit={() => console.log(`Edit ${type} ${item.id}`)}
        onDelete={() => console.log(`delete pressed`)}
      />
    );
  };

  // Fetch raw property list for horizontal scroll section
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

  // Render Home screen
  return (
    <Template navigation={navigation}>
      <View style={[styles.container, { backgroundColor: colors.primary }]}>

        {/* My Properties section of Home screen */}
        <Text style={[styles.headers]}>My Properties</Text>
        <ScrollView 
          style={[styles.properties]} 
          horizontal={true} 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 10, gap: 15 }}
        >
          {props.map((prop) => (
            <Card
              key={prop.id}
              width={340}
              height={125}
              title={prop.propName}
              type="Property"
              onPress={() => navigation.navigate('DetailScreen', {
                parentId: prop.id,
                parentType: 'property',
                title: prop.propName,
              })}
              onEdit={() => console.log(`Edit Property ${prop.id}`)}
              onDelete={() => console.log(`delete pressed`)}
            />
          ))}
        </ScrollView>

        {/* Recently Added Section of Home Screen */}
        <Text style={[styles.headers]}>Recently Added</Text>
        <View style={styles.recent}>
          <FlatList
            data={recentEntries}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={{ color: '#fff' }}>No recent entries</Text>}
            contentContainerStyle={{gap: 10}}
          />
        </View>

        {/* Inventory Summary Section */}
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

// Styling for Home Screen and components
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
