import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { theme } from '../../theme';
import { auth } from '../../../config';
import { addNewProperty } from '../../../firebase/firebaseHelpers'; // ✅ NEW

// Modal component for adding a new property
const HomeModal = ({ visible, onClose, onHomeAdded }) => {
  const [propertyName, setPropertyName] = useState('');
  const [roomCount, setRoomCount] = useState('');
  const [propertyValue, setPropertyValue] = useState('');

  const handleAddProperty = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('No user signed in.');
      return;
    }

    if (!propertyName || !roomCount || !propertyValue) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    if (propertyName.includes('/')) {
      Alert.alert('Property name cannot contain "/" character.');
      return;
    }

    try {
      const propertyData = {
        propName: propertyName.trim(),
        roomTotal: parseInt(roomCount, 10),
        propValue: parseFloat(propertyValue),
      };

      await addNewProperty(user.uid, propertyData);

      Alert.alert('Property added successfully!');
      if (onHomeAdded) onHomeAdded();

      setPropertyName('');
      setRoomCount('');
      setPropertyValue('');
      onClose();
    } catch (error) {
      Alert.alert('Error adding home: ' + error.message);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Property</Text>
          <TextInput
            style={styles.input}
            placeholder="Property Name"
            placeholderTextColor="#aaa"
            value={propertyName}
            onChangeText={setPropertyName}
          />
          <TextInput
            style={styles.input}
            placeholder="# of Rooms"
            placeholderTextColor="#aaa"
            value={roomCount}
            onChangeText={setRoomCount}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Estimated Property Value"
            placeholderTextColor="#aaa"
            value={propertyValue}
            onChangeText={setPropertyValue}
            keyboardType="numeric"
          />
          <View style={styles.buttonStructure}>
            <Button title="Close" onPress={onClose} color="red" />
            <Button title="Submit" onPress={handleAddProperty} />
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
