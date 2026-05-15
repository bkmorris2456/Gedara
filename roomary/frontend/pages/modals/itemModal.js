import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { Menu, Button, Provider as PaperProvider } from 'react-native-paper';
import { auth } from '../../../config';
import {
  getUserProperties,
  getRoomsForProperty,
  addItemToRoom,
} from '../../../firebase/firebaseHelpers';
import FormInput from '../../components/FormInput';
import { validateFields } from '../../../firebase/validation';

const ItemModal = ({ visible, onClose, onItemAdded }) => {
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [selectedPropertyName, setSelectedPropertyName] = useState('');
  const [selectedRoomName, setSelectedRoomName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [propertyMenuVisible, setPropertyMenuVisible] = useState(false);
  const [roomMenuVisible, setRoomMenuVisible] = useState(false);

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
      setSelectedPropertyName('');
      setSelectedRoomId('');
      setSelectedRoomName('');
      setRooms([]);
      setItemName('');
      setItemQuantity('');
      setEstimatedValue('');
    }
  }, [visible]);

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

  const handleAddItem = async () => {
    if (submitting) return;

    const error = validateFields({
      'Item Name': itemName,
      'Quantity': itemQuantity,
      'Estimated Value': estimatedValue,
      'Property': selectedPropertyId,
      'Room': selectedRoomId,
    });

    if (error) return Alert.alert(error);

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
      setSelectedPropertyName('');
      setSelectedRoomName('');
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
      <PaperProvider>
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.title}>Add Item</Text>

            {/* Property Picker */}
            <Menu
              visible={propertyMenuVisible}
              onDismiss={() => setPropertyMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setPropertyMenuVisible(true)}
                  style={styles.menuButton}
                  labelStyle={styles.menuButtonLabel}
                >
                  {selectedPropertyName || 'Select Property'}
                </Button>
              }
              contentStyle={styles.menuDropdown}
            >
              <FlatList
                data={properties}
                keyExtractor={(item) => item.id}
                style={styles.scrollableMenu}
                nestedScrollEnabled
                renderItem={({ item }) => (
                  <Menu.Item
                    onPress={() => {
                      setSelectedPropertyId(item.id);
                      setSelectedPropertyName(item.propName || 'Unnamed Home');
                      setRoomMenuVisible(false);
                      setSelectedRoomId('');
                      setSelectedRoomName('');
                      setPropertyMenuVisible(false);
                    }}
                    titleStyle={styles.menuItemText}
                    title={item.propName || 'Unnamed Home'}
                  />
                )}
              />
            </Menu>

            {/* Room Picker */}
            <Menu
              visible={roomMenuVisible}
              onDismiss={() => setRoomMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setRoomMenuVisible(true)}
                  style={styles.menuButton}
                  labelStyle={styles.menuButtonLabel}
                  disabled={!selectedPropertyId}
                >
                  {selectedRoomName || (rooms.length > 0 ? 'Select Room' : 'No Rooms Found')}
                </Button>
              }
              contentStyle={styles.menuDropdown}
            >
              <FlatList
                data={rooms}
                keyExtractor={(item) => item.id}
                style={styles.scrollableMenu}
                nestedScrollEnabled
                renderItem={({ item }) => (
                  <Menu.Item
                    onPress={() => {
                      setSelectedRoomId(item.id);
                      setSelectedRoomName(item.roomName);
                      setRoomMenuVisible(false);
                    }}
                    titleStyle={styles.menuItemText}
                    title={item.roomName}
                  />
                )}
              />
            </Menu>

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

            {/* Buttons */}
            <View style={styles.buttonStructure}>
              <Button onPress={onClose} mode="contained" color="red">
                Close
              </Button>
              <Button
                onPress={handleAddItem}
                mode="contained"
                disabled={submitting}
              >
                Submit
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </PaperProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderWidth: 1.5,
    borderColor: 'white',
    width: 320,
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
  menuButton: {
    width: '100%',
    marginBottom: 15,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
  },
  menuButtonLabel: {
    color: 'white',
    textAlign: 'left',
    flexShrink: 1,
  },
  menuDropdown: {
    backgroundColor: '#fff',
    paddingVertical: 0,
  },
  scrollableMenu: {
    maxHeight: 230, // approx 5 items
  },
  menuItemText: {
    color: 'black',
  },
  buttonStructure: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default ItemModal;
