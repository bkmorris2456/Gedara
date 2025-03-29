import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';
import { Provider as PaperProvider, Surface } from 'react-native-paper';
import { theme } from '../../theme';

const HomeModal = ({ visible, onClose }) => {
  const [homeName, setHomeName] = useState('');
  const [roomTotal, setRoomTotal] = useState('');
  const [houseValue, setHouseValue] = useState('');

  const { colors } = theme;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Home</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Home Name"
            placeholderTextColor="#aaa"
            value={homeName}
            onChangeText={setHomeName}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Number of Rooms"
            placeholderTextColor="#aaa"
            value={roomTotal}
            onChangeText={setRoomTotal}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Estimated House Value"
            placeholderTextColor="#aaa"
            value={houseValue}
            onChangeText={setHouseValue}
          />
          <View style={styles.buttonStructure}>
            <Button title="Close" onPress={onClose} color="red" />
            <Button title="Submit" onPress={onClose} />
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
    color: '#000',
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
