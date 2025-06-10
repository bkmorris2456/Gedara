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
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Modal component for adding a new property
const HomeModal = ({ visible, onClose, onHomeAdded }) => {

  // State variables and input fields
  const [propName, setPropName] = useState('');
  const [roomTotal, setRoomTotal] = useState('');
  const [propValue, setPropValue] = useState('');

  // Function to validate input information and add new property
  const addProperty = async () => {
    const user = auth.currentUser;

    // Check if user is authenticated
    if (!user) {
      alert('No user signed in.');
      return;
    }

    // Ensures all fields are filled
    if (!propName || !roomTotal || !propValue) {
      alert('Please fill in all fields.');
      return;
    }

    // Prevent any invalid characters
    if (propName.includes('/')) {
      alert('Property name cannot contain "/" character.');
      return;
    }

    try {

      // Clean and format input data
      const validPropData = {
        propName: propName.trim(),
        roomTotal: parseInt(roomTotal, 10),
        propValue: parseFloat(propValue),
        userId: user.uid,
        createdAt: serverTimestamp(), // Timestamp to track creation time
      };

      const propertiesRef = collection(db, 'properties'); // Reference to Firestore "properties" collection

      // Auto-generate a unique ID and add document
      await addDoc(propertiesRef, validPropData);

      alert('Property added successfully!');

      // Callback to refresh data in parent component
      if (onHomeAdded) {
        onHomeAdded(); // Refresh the home list
      }

      // Clear input fields and close modal
      setPropName('');
      setRoomTotal('');
      setPropValue('');
      onClose();

    } catch (error) {
      alert('Error adding home: ' + error.message);
    }
  };

  // Modal display
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Home</Text>
          <TextInput
            style={styles.input}
            placeholder="Property Name"
            placeholderTextColor="#aaa"
            value={propName}
            onChangeText={setPropName}
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
            placeholder="Estimated Property Value"
            placeholderTextColor="#aaa"
            value={propValue}
            onChangeText={setPropValue}
            keyboardType="numeric" // Ensures numeric input
          />
          <View style={styles.buttonStructure}>
            <Button title="Close" onPress={onClose} color="red" />
            <Button title="Submit" onPress={addProperty} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Modal UI Styling
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