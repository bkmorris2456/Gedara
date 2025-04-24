import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  Modal, 
  StyleSheet 
} from 'react-native';
import { theme } from '../../theme';
import { auth, db } from '../../../config';
import { collection, setDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';

const HomeModal = ({ visible, onClose }) => {
  const [homeName, setHomeName] = useState('');
  const [roomTotal, setRoomTotal] = useState('');
  const [houseValue, setHouseValue] = useState('');

  const { colors } = theme;

  // Function to add home using Home Modal Form
  const addHome = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('No user signed in.');
      return;
    }

    const userId = user.uid;
    const propertiesRef = collection(db, 'users', userId, 'properties');

    try {
      // Check if all fields are filled out
      if (!homeName || !roomTotal || !houseValue) {
        alert('Please fill in all fields.');
        return;
      }

      // Validate roomTotal and houseValue to be numbers
      const validHomeData = {
        homeName: homeName.trim(),
        roomTotal: parseInt(roomTotal, 10), // Convert roomTotal to an integer
        houseValue: parseFloat(houseValue), // Convert houseValue to a float
        createdAt: serverTimestamp(),
      };

      const propertyDocRef = doc(propertiesRef, homeName.trim());

      // Add the home document
      await setDoc(propertyDocRef, validHomeData);
      alert('Home added successfully!');

      // Clear the form fields
      setHomeName('');
      setRoomTotal('');
      setHouseValue('');

      // Close the modal after submission
      onClose();

    } catch (error) {
      alert('Error adding home: ' + error.message);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Home</Text>
          <TextInput
            style={styles.input}
            placeholder="Property Name"
            placeholderTextColor="#aaa"
            value={homeName}
            onChangeText={setHomeName}
          />
          <TextInput
            style={styles.input}
            placeholder="# of Rooms"
            placeholderTextColor="#aaa"
            value={roomTotal}
            onChangeText={setRoomTotal}
            keyboardType="numeric" // Ensures numeric input
          />
          <TextInput
            style={styles.input}
            placeholder="Estimated House Value"
            placeholderTextColor="#aaa"
            value={houseValue}
            onChangeText={setHouseValue}
            keyboardType="numeric" // Ensures numeric input
          />
          <View style={styles.buttonStructure}>
            <Button title="Close" onPress={onClose} color="red" />
            <Button title="Submit" onPress={addHome} />
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

export default HomeModal;
