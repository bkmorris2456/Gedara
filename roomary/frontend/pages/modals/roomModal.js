import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { Menu, Button, Provider as PaperProvider } from 'react-native-paper';
import { auth } from '../../../config';
import {
  getUserProperties,
  addRoomToProperty,
} from '../../../firebase/firebaseHelpers';
import FormInput from '../../components/FormInput';
import { validateFields } from '../../../firebase/validation';

const RoomModal = ({ visible, onClose, onRoomAdded }) => {
  const [roomName, setRoomName] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedPropertyName, setSelectedPropertyName] = useState('');
  const [properties, setProperties] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);

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
      setSelectedPropertyName('');
    }
  }, [visible]);

  const handleAddRoom = async () => {
    if (submitting) return;

    const error = validateFields({
      'Room Name': roomName,
      Property: selectedPropertyId,
    });
    if (error) return Alert.alert(error);

    try {
      setSubmitting(true);
      const user = auth.currentUser;
      if (!user) return;

      await addRoomToProperty(user.uid, roomName, selectedPropertyId);

      Alert.alert('Room added successfully!');
      if (onRoomAdded) onRoomAdded();

      setRoomName('');
      setSelectedPropertyId('');
      setSelectedPropertyName('');
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
      <PaperProvider>
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.title}>Add Room</Text>

            {/* Property Picker Menu */}
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setMenuVisible(true)}
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
                      setSelectedPropertyName(item.propName);
                      setMenuVisible(false);
                    }}
                    titleStyle={styles.menuItemText}
                    title={item.propName}
                  />
                )}
              />
            </Menu>

            {/* Room Name Input */}
            <FormInput
              placeholder="Room Name"
              value={roomName}
              onChangeText={setRoomName}
            />

            {/* Buttons */}
            <View style={styles.buttonStructure}>
              <Button onPress={onClose} mode="contained" color="red">
                Close
              </Button>
              <Button
                onPress={handleAddRoom}
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
    width: '80%',
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
    borderRadius: 4, // Less rounded
    justifyContent: 'center',
  },
  menuButtonLabel: {
    color: 'white',
    textAlign: 'left',
  },
  menuDropdown: {
    backgroundColor: '#fff',
    paddingVertical: 0,
  },
  scrollableMenu: {
    maxHeight: 230, // ~5 items at ~46px each
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

export default RoomModal;
