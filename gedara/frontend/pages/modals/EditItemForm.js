import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import FormInput from '../../components/FormInput';
import { useNavigation } from '@react-navigation/native';

const EditItemForm = ({ data, onSubmit }) => {
  const [name, setName] = useState(data?.itemName || '');
  const [quantity, setQuantity] = useState(data?.quantity?.toString() || '');
  const [value, setValue] = useState(data?.estVal?.toString() || '');
  const navigation = useNavigation();

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
      <View style={styles.form}>
        <Text style={styles.labelText}>Item Name</Text>
        <FormInput
          value={name}
          onChangeText={setName}
          placeholder="Item Name"
        />
        <Text style={styles.labelText}>Quantity</Text>
        <FormInput
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Quantity"
          keyboardType="numeric"
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

export default EditItemForm;

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
  form: { margin: 30},
  labelText: { 
    fontSize: {xs: '12px', 'md': '16px' },
    color: '#fff',
    marginTop: 25,
  },
});
