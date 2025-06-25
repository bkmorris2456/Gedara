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
      width={screenWidth * 0.82}
      height={125}
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
        height={100}
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
        style={{marginBottom: 10}}
      />
    );
  };

  return (
    <Template navigation={navigation}>
      <FlatList
        data={[]} // Required by FlatList
        renderItem={null}
        keyExtractor={() => 'container'}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={
          <>
            {/* My Properties */}
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
              scrollEnabled={true}
            />

            {/* Recently Added */}
            <Text style={styles.headers}>Recently Added</Text>
            <FlatList
              data={recentEntries}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              ListEmptyComponent={<Text style={styles.emptyText}>No recent entries</Text>}
              contentContainerStyle={{ gap: 10 }}
              scrollEnabled={false} // avoids nested scroll issue
            />

            {/* Inventory Summary */}
            <Text style={styles.headers}>Inventory Summary</Text>
            <View style={styles.summaries}>
              <Card width={120} height={100}><Text style={styles.general_text}>Total Items</Text></Card>
              <Card width={120} height={100}><Text style={styles.general_text}>Total Rooms</Text></Card>
              <Card width={120} height={100}><Text style={styles.general_text}>Total Value</Text></Card>
            </View>
          </>
        }
      />

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
  scrollContainer: {
    padding: 10,
    paddingBottom: 80,
    backgroundColor: theme.colors.primary,
  },
  headers: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
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
    marginTop: 20,
  },
  general_text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  emptyText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 10,
  },
});
