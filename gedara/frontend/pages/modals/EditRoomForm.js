import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import FormInput from '../../components/FormInput';
import { useNavigation } from '@react-navigation/native';

const EditRoomForm = ({ data, onSubmit }) => {
  const [name, setName] = useState(data?.roomName || '');
  const [value, setValue] = useState(data?.estVal?.toString() || '');
  const navigation = useNavigation();

  const handleUpdate = () => {
      const updates = {
      roomName: name,
      estVal: parseFloat(value),
      };

      onSubmit(updates);
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.labelText}>Room Name</Text>
        <FormInput
          value={name}
          onChangeText={setName}
          placeholder="Room Name"
        />
        <Text style={styles.labelText}>Estimated Value</Text>
        <FormInput
          value={value}
          onChangeText={setValue}
          placeholder="Estimated Value"
          keyboardType="numeric"
        />
        <View style={styles.buttons}>
          <Button title="Cancel" onPress={() => navigation.goBack()} color="red" />
          <Button title="Save" onPress={handleUpdate} />
        </View>
      </View>
    </View>
  );
};

export default EditRoomForm;

const styles = StyleSheet.create({
  container: { 
  borderRadius: 15,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
  justifyContent: 'space-between',
  backgroundColor: '#1e1e1e',
  maxHeight: 'auto',
  },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  form: { margin: 30, },
  labelText: { 
    fontSize: {xs: '12px', 'md': '16px' },
    color: '#fff',
    marginTop: 25,
  },
});
