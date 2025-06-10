import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth } from '../../../config';
import {
  getUserProperties,
  getRoomsForProperty,
  addItemToRoom,
} from '../../../firebase/firebaseHelpers';
import FormInput from '../../components/FormInput';
import DropdownPicker from '../../components/DropdownPicker';

const ItemModal = ({ visible, onClose, onItemAdded }) => {
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch properties when modal is shown
  useEffect(() => {
    const fetchProperties = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userProps = await getUserProperties(user.uid);
        setProperties(userProps);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    if (visible) {
      fetchProperties();
      setSelectedPropertyId('');
      setSelectedRoomId('');
      setRooms([]);
      setItemName('');
      setItemQuantity('');
      setEstimatedValue('');
    }
  }, [visible]);

  // Fetch rooms when property changes
  useEffect(() => {
    const fetchRooms = async () => {
      const user = auth.currentUser;
      if (!user || !selectedPropertyId) return;

      try {
        const userRooms = await getRoomsForProperty(user.uid, selectedPropertyId);
        setRooms(userRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    if (selectedPropertyId) {
      fetchRooms();
    }
  }, [selectedPropertyId]);

  // Submit item
  const handleAddItem = async () => {
    if (submitting) return;

    if (!itemName || !itemQuantity || !estimatedValue || !selectedPropertyId || !selectedRoomId) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    if (itemName.includes('/')) {
      Alert.alert('Item name cannot contain "/" character.');
      return;
    }

    try {
      setSubmitting(true);
      const user = auth.currentUser;
      if (!user) return;

      const itemData = {
        itemName: itemName.trim(),
        quantity: parseInt(itemQuantity),
        estVal: parseFloat(estimatedValue),
        roomId: selectedRoomId,
      };

      await addItemToRoom(user.uid, itemData);

      Alert.alert('Item added successfully!');
      if (onItemAdded) onItemAdded();

      setItemName('');
      setItemQuantity('');
      setEstimatedValue('');
      setSelectedPropertyId('');
      setSelectedRoomId('');
      onClose();
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error adding item: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Item</Text>

          {/* Property Picker */}
          <DropdownPicker
            selectedValue={selectedPropertyId}
            onValueChange={setSelectedPropertyId}
            items={properties.map((p) => ({ id: p.id, label: p.propName || 'Unnamed Home' }))}
            prompt="Select Property"
          />

          {/* Room Picker */}
          <DropdownPicker
            selectedValue={selectedRoomId}
            onValueChange={setSelectedRoomId}
            items={rooms.map((room) => ({ id: room.id, label: room.roomName }))}
            prompt={rooms.length > 0 ? 'Select Room' : 'No Rooms Found'}
          />

          {/* Item Fields */}
          <FormInput
            placeholder="Enter Item Name"
            value={itemName}
            onChangeText={setItemName}
          />

          <FormInput
            placeholder="Enter Quantity"
            value={itemQuantity}
            onChangeText={setItemQuantity}
            keyboardType="numeric"
          />

          <FormInput
            placeholder="Enter Est. Value"
            value={estimatedValue}
            onChangeText={setEstimatedValue}
            keyboardType="numeric"
          />

          <View style={styles.buttonStructure}>
            <Button title="Close" onPress={onClose} color="red" />
            <Button
              title="Submit"
              onPress={handleAddItem}
              disabled={submitting}
            />
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
