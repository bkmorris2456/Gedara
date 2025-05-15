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

const HomeModal = ({ visible, onClose, onHomeAdded }) => {
  const [propName, setPropName] = useState('');
  const [roomTotal, setRoomTotal] = useState('');
  const [propValue, setPropValue] = useState('');

  const { colors } = theme;

  // Function to add property
  const addProperty = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('No user signed in.');
      return;
    }

    if (!propName || !roomTotal || !propValue) {
      alert('Please fill in all fields.');
      return;
    }

    if (propName.includes('/')) {
      alert('Property name cannot contain "/" character.');
      return;
    }

    try {
      const validPropData = {
        propName: propName.trim(),
        roomTotal: parseInt(roomTotal, 10),
        propValue: parseFloat(propValue),
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      const propertiesRef = collection(db, 'properties');

      // Auto-generate a unique ID and add document
      await addDoc(propertiesRef, validPropData);

      alert('Property added successfully!');

      if (onHomeAdded) {
        onHomeAdded(); // Refresh the home list
      }

      // Clear form fields
      setPropName('');
      setRoomTotal('');
      setPropValue('');
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