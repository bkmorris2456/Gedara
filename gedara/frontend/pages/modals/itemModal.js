import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Alert } from 'react-native';
import { theme } from '../../theme';
import { auth, db } from '../../../config';
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

// Modal component to add items to a given room within a specific property
const ItemModal = ({ visible, onClose }) => {

  // State variables for form fields and data
  const [itemName, setItemName] = useState('');
  const [itemQuant, setItemQuant] = useState('');
  const [estValue, setEstValue] = useState('');
  const [props, setProps] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedProp, setSelectedProp] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  const { colors } = theme;

  // Fetch properties when modal is visible
  useEffect(() => {
    const fetchProps = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const propsQuery = query(
          collection(db, 'properties'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(propsQuery);

        // Store list of properties for Picker
        const propsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProps(propsList);
      } catch (error) {
        console.error('Error fetching properties: ', error);
      }
    };

    if (visible) {
      fetchProps();
      // Reset form fields and related state
      setSelectedProp('');
      setSelectedRoom('');
      setRooms([]);
    }
  }, [visible]);

  // Fetch rooms when a property is selected
  useEffect(() => {
    const fetchRooms = async () => {
      const user = auth.currentUser;
      if (!user || !selectedProp) return;

      try {
        const roomsQuery = query(
          collection(db, 'rooms'),
          where('homeId', '==', selectedProp),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(roomsQuery);

        // Store rooms to allow selection
        const roomsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomsList);
        setSelectedRoom(''); // Reset room selection when home changes
      } catch (error) {
        console.error('Error fetching rooms: ', error);
      }
    };

    fetchRooms();
  }, [selectedProp]);

  // Add new item to Firestore
  const addItem = async () => {

    // Validate all fields
    if (!itemName || !itemQuant || !estValue || !selectedProp || !selectedRoom) {
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
          userId: user.uid,
          createdAt: serverTimestamp(),
        };

        const itemsRef = collection(db, 'items');
        await addDoc(itemsRef, itemData);

        Alert.alert('Item added successfully!');

        // Clear form and close modal
        setItemName('');
        setItemQuant('');
        setEstValue('');
        setSelectedRoom('');
        setSelectedProp('');
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

          {/* Property Picker */}
          <Picker
            selectedValue={selectedProp}
            onValueChange={(itemValue) => setSelectedProp(itemValue)}
            style={{ width: '100%', height: 50 }}
          >
            <Picker.Item label="Select Property" value="" />
            {props.map((home) => (
              <Picker.Item key={home.id} label={home.propName || "Unnamed Home"} value={home.id} />
            ))}
          </Picker>

          {/* Room Picker */}
          <Picker
            selectedValue={selectedRoom}
            onValueChange={(itemValue) => setSelectedRoom(itemValue)}
            style={{ width: '100%', height: 50, marginTop: 10 }}
            enabled={rooms.length > 0}
          >
            <Picker.Item label={rooms.length > 0 ? "Select Room" : "No Rooms Found"} value="" />
            {rooms.map((room) => (
              <Picker.Item key={room.id} label={room.roomName} value={room.id} />
            ))}
          </Picker>

          {/* Inputs */}
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

// Modal Styling
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
