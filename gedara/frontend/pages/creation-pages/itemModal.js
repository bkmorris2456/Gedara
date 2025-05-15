import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Alert } from 'react-native';
import { theme } from '../../theme';
import { auth, db } from '../../../config';
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const ItemModal = ({ visible, onClose }) => {
  const [itemName, setItemName] = useState('');
  const [itemQuant, setItemQuant] = useState('');
  const [estValue, setEstValue] = useState('');
  const [homes, setHomes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedHome, setSelectedHome] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  
  const { colors } = theme;

  // Fetch homes
  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const homesRef = collection(db, 'properties');
        const querySnapshot = await getDocs(homesRef);
        const homesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHomes(homesList);
      } catch (error) {
        console.error('Error fetching homes: ', error);
      }
    };

    if (visible) fetchHomes();
  }, [visible]);

  // Fetch rooms for selected home
  useEffect(() => {
    const fetchRooms = async () => {
      if (selectedHome) {
        try {
          const roomsRef = collection(db, 'rooms');
          const roomQuery = query(roomsRef, where('homeId', '==', selectedHome));
          const querySnapshot = await getDocs(roomQuery);
          const roomsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRooms(roomsList);
        } catch (error) {
          console.error('Error fetching rooms: ', error);
        }
      }
    };

    fetchRooms();
  }, [selectedHome]);

  const addItem = async () => {
    if (!itemName || !itemQuant || !estValue || !selectedHome || !selectedRoom) {
      Alert.alert('Please fill in all fields.');
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
          quantity: parseInt(itemQuant),
          estVal: parseFloat(estValue),
          roomId: selectedRoom,
          createdAt: serverTimestamp(),
        };

        const itemsRef = collection(db, 'items');
        await addDoc(itemsRef, itemData);

        Alert.alert('Item added successfully!');
        setItemName('');
        setItemQuant('');
        setEstValue('');
        setSelectedRoom('');
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
          <Picker
            selectedValue={selectedHome}
            onValueChange={(itemValue) => setSelectedHome(itemValue)}
            style={{ width: '100%', height: 50 }}
          >
            <Picker.Item label="Select Home" value="" />
            {homes.map((home) => (
              <Picker.Item key={home.id} label={home.propName || "Unnamed Home"} value={home.id} />
            ))}
          </Picker>

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
            placeholder="Enter Quantity"
            placeholderTextColor="#aaa"
            value={itemQuant}
            onChangeText={setItemQuant}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Est. Value"
            placeholderTextColor="#aaa"
            value={estValue}
            onChangeText={setEstValue}
            keyboardType="numeric"
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
