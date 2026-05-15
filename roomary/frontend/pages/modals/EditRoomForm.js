import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  Modal,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../../config';
import FormInput from '../../components/FormInput';

const screenWidth = Dimensions.get('window').width;

export default function EditRoomForm({ data, onSubmit }) {
  const navigation = useNavigation();

  const [name, setName] = useState(data?.roomName || '');
  const [value, setValue] = useState(data?.estVal?.toString() || '');

  const [selectedProperty, setSelectedProperty] = useState(data?.homeId || null);
  const [propertyLabel, setPropertyLabel] = useState('Choose a property');
  const [properties, setProperties] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const propsQuery = query(collection(db, 'properties'), where('userId', '==', userId));
      const snapshot = await getDocs(propsQuery);

      const propList = snapshot.docs.map(doc => ({
        id: doc.id,
        label: doc.data().propName,
      }));

      setProperties(propList);

      const selected = propList.find(p => p.id === data?.homeId);
      if (selected) setPropertyLabel(selected.label);
    };

    fetchProperties();
  }, []);

  const handleUpdate = () => {
    const updates = {
      roomName: name,
      estVal: parseFloat(value),
      homeId: selectedProperty,
    };
    onSubmit(updates);
  };

  return (
    <View style={styles.container}>
      {/* Room Name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.labelText}>Room Name</Text>
        <FormInput
          value={name}
          onChangeText={setName}
          placeholder="Room Name"
        />
      </View>

      {/* Estimated Value */}
      <View style={styles.fieldGroup}>
        <Text style={styles.labelText}>Estimated Value</Text>
        <FormInput
          value={value}
          onChangeText={setValue}
          placeholder="Estimated Value"
          keyboardType="numeric"
        />
      </View>

      {/* Modal Picker */}
      <View style={styles.fieldGroup}>
        <Text style={styles.labelText}>Select Property</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.modalButton}>
          <Text style={styles.modalButtonText}>{propertyLabel}</Text>
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <Button title="Cancel" onPress={() => navigation.goBack()} color="red" />
        <Button title="Save" onPress={handleUpdate} />
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Property</Text>
            <FlatList
              data={properties}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedProperty(item.id);
                    setPropertyLabel(item.label);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </Pressable>
              )}
            />
            <Pressable onPress={() => setModalVisible(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
    padding: 20,
    width: screenWidth * 0.9,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  labelText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  modalButton: {
    backgroundColor: '#2c2c2e',
    padding: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#2c2c2e',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalItem: {
    paddingVertical: 12,
  },
  modalItemText: {
    color: '#fff',
    fontSize: 16,
  },
  modalCancel: {
    marginTop: 20,
    alignSelf: 'center',
  },
  modalCancelText: {
    color: '#89CFF0',
    fontSize: 16,
  },
});
