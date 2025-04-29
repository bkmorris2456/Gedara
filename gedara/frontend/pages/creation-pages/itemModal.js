import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Alert } from 'react-native';
import { theme } from '../../theme';
import { auth, db } from '../../../config';
import { collection, getDocs, setDoc, addDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const ItemModal = ({ visible, onClose }) => {
  const [itemName, setItemName] = useState('');
  const [itemQuant, setItemQuant] = useState('');
  const [homes, setHomes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedHome, setSelectedHome] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  
  const { colors } = theme;

  // Fetch homes when modal is opened
  useEffect(() => {
    const fetchHomes = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userHomesRef = collection(db, 'users', user.uid, 'properties');
          const querySnapshot = await getDocs(userHomesRef);
          const homesList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setHomes(homesList);
        } catch (error) {
          console.error('Error fetching homes: ', error);
        }
      }
    };

    if (visible) {
      fetchHomes();
    }
  }, [visible]);

  // Fetch rooms for the selected home
  useEffect(() => {
    const fetchRooms = async () => {
      if (selectedHome) {
        const user = auth.currentUser;
        if (user) {
          try {
            const roomsRef = collection(db, 'users', user.uid, 'properties', selectedHome, 'rooms');
            const querySnapshot = await getDocs(roomsRef);
            const roomsList = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setRooms(roomsList);
          } catch (error) {
            console.error('Error fetching rooms: ', error);
          }
        }
      }
    };

    fetchRooms();
  }, [selectedHome]);

  const addItem = async () => {
    if (!itemName || !itemQuant || !selectedHome || !selectedRoom) {
      alert('Please fill in all fields.');
      return;
    }

    if (itemName.includes('/')) {
      Alert.alert('Item name cannot contain "/" character.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const itemData = {
          itemName: itemName.trim(),
          itemQuant: parseInt(itemQuant),
          homeId: selectedHome,
          roomId: selectedRoom,
          createdAt: serverTimestamp(),
        };

        const itemDocRef = doc(db, 'users', user.uid, 'properties', selectedHome, 'rooms', selectedRoom, 'items', itemName.trim());
        await setDoc(itemDocRef, itemData);

        Alert.alert('Item added successfully!');
        setItemName('');
        setItemQuant('');
        onClose();
      }
    } catch (error) {
      console.error('Error adding item: ', error);
      Alert.alert('Error adding item: ' + error.message);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Item</Text>

          {/* Home Picker */}
          {homes.length > 0 && (
            <Picker
              selectedValue={selectedHome}
              onValueChange={(itemValue) => setSelectedHome(itemValue)}
              style={{ width: '100%', height: 50 }}
            >
              <Picker.Item label="Select Home" value="" />
              {homes.map((home) => (
                <Picker.Item key={home.id} label={home.homeName || "Unnamed Home"} value={home.id} />
              ))}
            </Picker>
          )}

          {/* Room Picker */}
          {rooms.length > 0 && selectedHome && (
            <Picker
              selectedValue={selectedRoom}
              onValueChange={(itemValue) => setSelectedRoom(itemValue)}
              style={{ width: '100%', height: 50, marginTop: 10 }}
            >
              <Picker.Item label="Select Room" value="" />
              {rooms.map((room) => (
                <Picker.Item key={room.id} label={room.roomName} value={room.id} />
              ))}
            </Picker>
          )}

          <TextInput
            style={styles.input}
            placeholder="Enter Item Name"
            placeholderTextColor="#aaa"
            value={itemName}
            onChangeText={setItemName}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Item Quantity"
            placeholderTextColor="#aaa"
            value={itemQuant}
            onChangeText={setItemQuant}
          />
          <View style={styles.buttonStructure}>
            <Button title="Close" onPress={onClose} color="red" />
            <Button title="Submit" onPress={addItem} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#0a0a0a',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'white',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    marginVertical: 15,
    padding: 5,
    color: '#fff',
    borderColor: 'white',
  },
  buttonStructure: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 55,
  },
});

export default ItemModal;
