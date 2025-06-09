import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../../../config';
import { collection, getDocs, addDoc, doc, serverTimestamp, setDoc, runTransaction } from 'firebase/firestore';

const RoomModal = ({ visible, onClose }) => {
  const [roomName, setRoomName] = useState('');
  const [selectedProp, setSelectedProp] = useState('');
  const [props, setProps] = useState([]);

  // Fetch homes when modal is opened
  useEffect(() => {
    const fetchProps = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const allPropsRef = collection(db, 'properties');
          const querySnapshot = await getDocs(allPropsRef);
          const userProps = querySnapshot.docs
            .filter(doc => doc.data().userId === user.uid)
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
          setProps(userProps);
        } catch (error) {
          console.error('Error fetching properties: ', error);
        }
      }
    };

    if (visible) {
      fetchProps();
    }
  }, [visible]);

  // Function to add room to user's selected property
  const addRoom = async () => {
    if (!roomName || !selectedProp) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    if (roomName.includes('/')) {
      Alert.alert('Room name cannot contain "/" character.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) return;

      const roomRef = doc(collection(db, 'rooms')); // Generate doc ref
      const propertyRef = doc(db, 'properties', selectedProp);

      await runTransaction(db, async (transaction) => {
        const propDoc = await transaction.get(propertyRef);
        if (!propDoc.exists()) {
          throw new Error('Property does not exist');
        }

        const currentTotal = propDoc.data().roomTotal || 0;

        transaction.set(roomRef, {
          roomName: roomName.trim(),
          homeId: selectedProp,
          userId: user.uid,
          estVal: 0,
          createdAt: serverTimestamp(),
        });

        transaction.update(propertyRef, {
          roomTotal: currentTotal + 1,
        });
      });

      Alert.alert('Room added successfully!');
      setRoomName('');
      setSelectedProp('');
      onClose();

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
          {props.length > 0 && (
            <Picker
              selectedValue={selectedProp}
              onValueChange={(itemValue) => setSelectedProp(itemValue)}
              style={{ width: '100%', height: 'auto' }}
            >
              <Picker.Item label="Select Property" value="" />
              {props.map((prop) => (
                <Picker.Item key={prop.id} label={prop.propName} value={prop.id} />
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
