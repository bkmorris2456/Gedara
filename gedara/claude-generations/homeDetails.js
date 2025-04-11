// src/screens/HomeDetails.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { getHomeById, getRoomsByHomeId, createRoom } from '../firebase';

export default function HomeDetailsScreen({ route, navigation }) {
  const { homeId } = route.params;
  const [home, setHome] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const fetchHomeData = async () => {
    try {
      const { home, error: homeError } = await getHomeById(homeId);
      if (homeError) {
        Alert.alert('Error', homeError.message);
        return;
      }
      
      setHome(home);
      navigation.setParams({ homeName: home.name });
      
      const { rooms, error: roomsError } = await getRoomsByHomeId(homeId);
      if (roomsError) {
        Alert.alert('Error', roomsError.message);
        return;
      }
      
      setRooms(rooms || []);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
    
    // Refresh when screen is focused
    const unsubscribe = navigation.addListener('focus', fetchHomeData);
    return unsubscribe;
  }, [homeId, navigation]);

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) {
      Alert.alert('Error', 'Please enter a room name');
      return;
    }
    
    try {
      const { roomId, error } = await createRoom(homeId, {
        name: newRoomName.trim()
      });
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setNewRoomName('');
        setShowAddForm(false);
        fetchHomeData();
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.roomItem}
      onPress={() => navigation.navigate('RoomDetails', { 
        roomId: item.id,
        roomName: item.name,
        homeId
      })}
    >
      <Text style={styles.roomName}>{item.name}</Text>
      <Text>Items: {item.totalItems || 0}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading home details...</Text>
      </View>
    );
  }

  if (!home) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Home not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.homeInfo}>
        <Text style={styles.homeName}>{home.name}</Text>
        <View style={styles.stats}>
          <Text style={styles.statItem}>Rooms: {home.totalRooms || 0}</Text>
          <Text style={styles.statItem}>Items: {home.totalItems || 0}</Text>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Rooms</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Text style={styles.addButtonText}>
            {showAddForm ? 'Cancel' : 'Add Room'}
          </Text>
        </TouchableOpacity>
      </View>

      {showAddForm && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Room Name"
            value={newRoomName}
            onChangeText={setNewRoomName}
          />
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleAddRoom}
          >
            <Text style={styles.submitButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      )}

      {rooms.length === 0 ? (
        <Text style={styles.emptyText}>
          No rooms added yet. Add your first room!
        </Text>
      ) : (
        <FlatList
          data={rooms}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

// src/screens/RoomDetails.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { db, getItemsByRoomId, createItem } from '../firebase';

export default function RoomDetailsScreen({ route, navigation }) {
  const { roomId, homeId } = route.params;
  const [room, setRoom] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');

  const fetchRoomData = async () => {
    try {
      // Get room data
      const roomDoc = await getDoc(doc(db, 'rooms', roomId));
      if (!roomDoc.exists()) {
        Alert.alert('Error', 'Room not found');
        navigation.goBack();
        return;
      }
      
      const roomData = { id: roomDoc.id, ...roomDoc.data() };
      setRoom(roomData);
      
      // Get items in this room
      const { items, error } = await getItemsByRoomId(roomId);
      if (error) {
        Alert.alert('Error', error.message);
        return;
      }
      
      setItems(items || []);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomData();
    
    // Refresh when screen is focused
    const unsubscribe = navigation.addListener('focus', fetchRoomData);
    return unsubscribe;
  }, [roomId, navigation]);

  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }
    
    const quantity = parseInt(newItemQuantity) || 1;
    
    try {
      const { itemId, error } = await createItem(roomId, homeId, {
        name: newItemName.trim(),
        quantity
      });
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setNewItemName('');
        setNewItemQuantity('1');
        setShowAddForm(false);
        fetchRoomData();
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemQuantity}>Quantity: {item.quantity || 1}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading room details...</Text>
      </View>
    );
  }

  if (!room) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Room not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{room.name}</Text>
        <Text style={styles.itemCount}>Total Items: {room.totalItems || 0}</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Items</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Text style={styles.addButtonText}>
            {showAddForm ? 'Cancel' : 'Add Item'}
          </Text>
        </TouchableOpacity>
      </View>

      {showAddForm && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={newItemName}
            onChangeText={setNewItemName}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={newItemQuantity}
            onChangeText={setNewItemQuantity}
            keyboardType="numeric"
          />
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleAddItem}
          >
            <Text style={styles.submitButtonText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      )}

      {items.length === 0 ? (
        <Text style={styles.emptyText}>
          No items added yet. Add your first item!
        </Text>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

// src/screens/Profile.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../firebase';

export default function ProfileScreen() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        Alert.alert('Error', error.message);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Not logged in</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.title}>My Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user.displayName || 'Not set'}</Text>
        
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  profileHeader: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
  },
  signOutButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});