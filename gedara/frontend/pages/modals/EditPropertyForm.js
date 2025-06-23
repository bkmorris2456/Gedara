import React, { useState } from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import FormInput from '../../components/FormInput';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config';

const EditPropertyForm = ({ data, onSubmit, onCancel }) => {
  const [name, setName] = useState(data?.propName || '');
  const [value, setValue] = useState(data?.propValue?.toString() || '');

  const handleUpdate = () => {
    const updates = {
      propName: name,
      propValue: parseFloat(value),
      estVal: parseFloat(value), // assuming estVal is also tracked here
    };

    onSubmit(updates); // ✅ Call parent with the updates
  };

  return (
    <View style={styles.container}>
      <FormInput
        value={name}
        onChangeText={setName}
        placeholder="Property Name"
      />
      <FormInput
        value={value}
        onChangeText={setValue}
        placeholder="Property Value"
        keyboardType="numeric"
      />
      <View style={styles.buttons}>
        <Button title="Cancel" onPress={onCancel} color="red" />
        <Button title="Save" onPress={handleUpdate} />
      </View>
    </View>
  );
};

export default EditPropertyForm;

const styles = StyleSheet.create({
  container: { gap: 15 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});
