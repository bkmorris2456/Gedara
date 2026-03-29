import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import Template from '../pages/template';
import Card from '../components/card';
import { Text } from 'react-native-paper';
import { theme } from '../theme';
import { auth, db } from '../../config';
import {
  collection,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import DeletionModal from '../pages/modals/deletionModal';
import { deleteElementAndChildren } from '../../firebase/firebaseHelpers';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Home({ navigation }) {
  const { colors } = theme;

  const [props, setProps] = useState([]);
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [items, setItems] = useState([]);
  const [recentEntries, setRecentEntries] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const propsQuery = query(collection(db, 'properties'), where('userId', '==', userId));
    const roomsQuery = query(collection(db, 'rooms'), where('userId', '==', userId));
    const itemsQuery = query(collection(db, 'items'), where('userId', '==', userId));

    const unsubProps = onSnapshot(propsQuery, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProps(data);
      setProperties(data.map(item => ({ ...item, type: 'Property' })));
    });

    const unsubRooms = onSnapshot(roomsQuery, (snap) => {
      setRooms(snap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Room' })));
    });

    const unsubItems = onSnapshot(itemsQuery, (snap) => {
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Item' })));
    });

    return () => {
      unsubProps();
      unsubRooms();
      unsubItems();
    };
  }, []);

  useEffect(() => {
    const all = [...properties, ...rooms, ...items];
    const sorted = all
      .filter(e => e.createdAt)
      .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
      .slice(0, 5);
    setRecentEntries(sorted);
  }, [properties, rooms, items]);

  const renderPropertyCard = ({ item }) => (
    <Card
      width={screenWidth * 0.80}
      height={120}
      title={item.propName || 'Unnamed Property'}
      type="Property"
      onPress={() => navigation.navigate('DetailScreen', {
        parentId: item.id,
        parentType: 'property',
        title: item.propName,
      })}
      onEdit={() => navigation.navigate('EditElement', {
        elementType: 'property',
        data: item,
      })}
      onDelete={() => {
        setItemToDelete({ id: item.id, type: 'property' });
        setShowDeleteModal(true);
      }}
    />
  );

  const renderItem = ({ item }) => {
    const displayName =
      item.type === 'Property' ? item.propName :
      item.type === 'Room' ? item.roomName :
      item.type === 'Item' ? item.itemName :
      'Unnamed';

    return (
      <Card
        width={screenWidth * 0.82}
        height={120}
        title={displayName}
        type={item.type}
        onPress={() => {
          const parentType = item.type.toLowerCase();
          if (parentType === 'property' || parentType === 'room') {
            navigation.navigate('DetailScreen', {
              parentId: item.id,
              parentType,
              title: displayName,
            });
          }
        }}
        onEdit={() =>
          navigation.navigate('EditElement', {
            elementType: item.type.toLowerCase(),
            data: item,
          })
        }
        onDelete={() => {
          setItemToDelete({ id: item.id, type: item.type.toLowerCase() });
          setShowDeleteModal(true);
        }}
      />
    );
  };

  return (
    <Template navigation={navigation}>
      <View style={styles.container}>

        {/* My Properties */}
        <View style={{ height: screenHeight * 0.2 }}>
          <Text style={styles.headers}>My Properties</Text>
          <FlatList
            data={props}
            renderItem={renderPropertyCard}
            keyExtractor={item => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={screenWidth * 0.9 + 10}
            decelerationRate="fast"
            contentContainerStyle={styles.horizontalScroll}
          />
        </View>

        {/* Recently Added (scrollable) */}
        <View style={{ height: screenHeight * 0.32 }}>
          <Text style={styles.headers}>Recently Added</Text>
          <FlatList
            data={recentEntries}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.emptyText}>No recent entries</Text>}
            contentContainerStyle={{ gap: 10 }}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
          />
        </View>

        {/* Inventory Summary */}
        <View style={{ minHeight: screenHeight * 0.2, paddingBottom: 20 }}>
          <Text style={styles.headers}>Inventory Summary</Text>
            <View style={styles.summaries}>
              <Card width={120} height={110} style={styles.summaryCard}>
                <Text style={styles.summaryText}>Total Items</Text>
              </Card>
              <Card width={120} height={110} style={styles.summaryCard}>
                <Text style={styles.summaryText}>Total Rooms</Text>
              </Card>
              <Card width={120} height={110} style={styles.summaryCard}>
                <Text style={styles.summaryText}>Total Value</Text>
              </Card>
            </View>
        </View>
      </View>

      <DeletionModal
        visible={showDeleteModal}
        elementType={itemToDelete?.type}
        onCancel={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={async () => {
          if (!itemToDelete?.type || !itemToDelete?.id) return;

          try {
            await deleteElementAndChildren(itemToDelete.type, itemToDelete.id);
            console.log(`Deleted ${itemToDelete.type} with ID: ${itemToDelete.id}`);
          } catch (error) {
            console.error('Error deleting element:', error);
          } finally {
            setShowDeleteModal(false);
            setItemToDelete(null);
          }
        }}
      />
    </Template>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: theme.colors.primary,
  },
  headers: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  horizontalScroll: {
    paddingLeft: 10,
    paddingRight: 10,
    gap: 10,
  },
  summaries: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  general_text: {
    display: 'flex',
    color: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 14,
  },
  emptyText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 10,
  },
  summaryCard: {
  justifyContent: 'flex-start',
  paddingTop: 10,
  paddingHorizontal: 5,
  },
  summaryText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    justifyContent: 'center',
  },
});
