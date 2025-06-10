import React, { useEffect, useState } from 'react';
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
  addRoomToProperty,
} from '../../../firebase/firebaseHelpers';

const RoomModal = ({ visible, onClose, onRoomAdded }) => {
  const [roomName, setRoomName] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [properties, setProperties] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch properties when modal opens
  useEffect(() => {
    const fetchProperties = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userProps = await getUserProperties(user.uid);
          setProperties(userProps);
        } catch (error) {
          console.error('Error fetching properties:', error);
        }
      }
    };

    if (visible) {
      fetchProperties();
      setRoomName('');
      setSelectedPropertyId('');
    }
  }, [visible]);

  // Submit new room
  const handleAddRoom = async () => {
    if (submitting) return;

    if (!roomName || !selectedPropertyId) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    if (roomName.includes('/')) {
      Alert.alert('Room name cannot contain "/" character.');
      return;
    }

    try {
      setSubmitting(true);
      const user = auth.currentUser;
      if (!user) return;

      await addRoomToProperty(user.uid, roomName, selectedPropertyId);

      Alert.alert('Room added successfully!');
      if (onRoomAdded) onRoomAdded();

      setRoomName('');
      setSelectedPropertyId('');
      onClose();
    } catch (error) {
      console.error('Error adding room:', error);
      Alert.alert('Error adding room: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Room</Text>

          {/* Property Picker */}
          <Picker
            selectedValue={selectedPropertyId}
            onValueChange={(itemValue) => setSelectedPropertyId(itemValue)}
            style={{ width: '100%', height: 'auto' }}
          >
            <Picker.Item label="Select Property" value="" />
            {properties.map((property) => (
              <Picker.Item
                key={property.id}
                label={property.propName}
                value={property.id}
              />
            ))}
          </Picker>

          {/* Room Name Input */}
          <TextInput
            style={styles.input}
            placeholder="Room Name"
            placeholderTextColor="#aaa"
            value={roomName}
            onChangeText={setRoomName}
          />

          <View style={styles.buttonStructure}>
            <Button title="Close" onPress={onClose} color="red" />
            <Button
              title="Submit"
              onPress={handleAddRoom}
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

export default RoomModal;
