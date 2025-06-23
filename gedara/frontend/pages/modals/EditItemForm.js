import React, { useState } from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import FormInput from '../../components/FormInput';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config';

const EditItemForm = ({ data, onSubmit, onCancel }) => {
  const [name, setName] = useState(data?.itemName || '');
  const [quantity, setQuantity] = useState(data?.quantity?.toString() || '');
  const [value, setValue] = useState(data?.estVal?.toString() || '');

  const handleUpdate = () => {
    const updates = {
      itemName: name,
      quantity: parseInt(quantity),
      estVal: parseFloat(value),
    };
    onSubmit(updates);
  };

  return (
    <View style={styles.container}>
      <FormInput
        value={name}
        onChangeText={setName}
        placeholder="Item Name"
      />
      <FormInput
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Quantity"
        keyboardType="numeric"
      />
      <FormInput
        value={value}
        onChangeText={setValue}
        placeholder="Estimated Value"
        keyboardType="numeric"
      />
      <View style={styles.buttons}>
        <Button title="Cancel" onPress={onCancel} color="red" />
        <Button title="Save" onPress={handleUpdate} />
      </View>
    </View>
  );
};

export default EditItemForm;

const styles = StyleSheet.create({
  container: { gap: 15 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});
