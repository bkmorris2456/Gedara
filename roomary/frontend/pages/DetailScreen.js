import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { db } from '../../config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Template from './template';
import Card from '../components/card';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import DeletionModal from '../pages/modals/deletionModal';
import { deleteElementAndChildren } from '../../firebase/firebaseHelpers';

// Template screen to display all elements under parent element
export default function DetailScreen({ navigation }) {
  const { colors } = theme;
  const route = useRoute();
  const { parentId, parentType, title } = route.params;
  const [children, setChildren] = useState([]);

  // states for element deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // holds { id, type }

  // Fetch the children data from Firestore based on parent type
  useEffect(() => {
    let coll = '';
    let field = '';

    // Determine the collection and foreign key field based on parent type
    if (parentType === 'property') {
      coll = 'rooms';
      field = 'homeId';
    } else if (parentType === 'room') {
      coll = 'items';
      field = 'roomId';
    } else {
      return; // Invalid parent type, do nothing
    }

    // Set up Firestore query to get matchign children
    const q = query(collection(db, coll), where(field, '==', parentId));

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChildren(data);
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, [parentId, parentType]);

  // Render screen content
  return (
    <Template navigation={navigation}>

      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Page content container */}
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <Text style={styles.headers}>{title}</Text>

        {/* Children elements list */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 15 }}>
          {children.map(child => (
            <Card
              key={child.id}
              width={350}
              height={120}
              title={child.roomName || child.itemName}
              type={parentType === 'property' ? 'Room' : 'Item'}
              onPress={() => {
                // Navigate deeper into nested structure if child is a room
                if (parentType === 'property') {
                  navigation.push('DetailScreen', {
                    parentId: child.id,
                    parentType: 'room',
                    title: child.roomName,
                  });
                }
              }}
              onEdit={() =>
                navigation.navigate('EditElement', {
                  elementType: parentType === 'property' ? 'room' : 'item',
                  data: child,
                })
              }
              onDelete={() => {
                setItemToDelete({
                  id: child.id,
                  type: parentType === 'property' ? 'room' : 'item',
                });
                setShowDeleteModal(true);
              }}
            />
          ))}
        </ScrollView>
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
            Alert.alert('Deleted!', `${itemToDelete.type} has been removed.`);
            setShowDeleteModal(false);
            setItemToDelete(null);
          }
        }}
      />

    </Template>
  );
}

// Screen Styling
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
