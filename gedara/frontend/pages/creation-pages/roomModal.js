import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../../../config';
import { collection, getDocs, setDoc, addDoc, doc, serverTimestamp } from 'firebase/firestore';

const RoomModal = ({ visible, onClose }) => {
  const [roomName, setRoomName] = useState('');
  const [selectedHome, setSelectedHome] = useState('');
  const [homes, setHomes] = useState([]);

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

  const addRoom = async() => {
    if (!roomName || !selectedHome) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const roomData = {
          roomName: roomName.trim(),
          homeId: selectedHome,
          createdAt: serverTimestamp(),
        };

        const roomRef = collection(db, 'users', user.uid, 'properties', selectedHome, 'rooms');

        await addDoc(roomRef, roomData);
        Alert.alert('Room added successfully!');

        setRoomName('');
        setSelectedHome('');
        onClose();
      }

    } catch (error) {
      console.error('Error adding room: ', error);
      Alert.alert('Error adding room: ' + error.message);
    }

  };
  
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Room</Text>

          {/* Homes Picker */}
          {homes.length > 0 && (
            <Picker
              selectedValue={selectedHome}
              onValueChange={(itemValue) => setSelectedHome(itemValue)}
              style={{ width: '100%', height: 'auto' }}
            >
              <Picker.Item label="Select Home" value="" />
              {homes.map((home) => (
                <Picker.Item key={home.id} label={home.homeName} value={home.id} />
              ))}
            </Picker>
          )}

          <TextInput
            style={styles.input}
            placeholder="Room Name"
            placeholderTextColor="#aaa"
            value={roomName}
            onChangeText={setRoomName}
          />

          <View style={styles.buttonStructure}>
            <Button title="Close" onPress={onClose} color="red" />
            <Button title="Submit" onPress={addRoom} />
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

export default RoomModal;
