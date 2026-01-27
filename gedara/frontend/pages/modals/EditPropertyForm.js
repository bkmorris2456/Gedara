import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Dimensions } from 'react-native';
import FormInput from '../../components/FormInput';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const EditPropertyForm = ({ data, onSubmit }) => {
  const [name, setName] = useState(data?.propName || '');
  const [value, setValue] = useState(data?.propValue?.toString() || '');
  const navigation = useNavigation();

  const handleUpdate = () => {
    const updates = {
      propName: name,
      propValue: parseFloat(value),
      estVal: parseFloat(value), // assuming estVal is also tracked here
    };

    onSubmit(updates);
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.labelText}>Property Name</Text>
        <FormInput
          value={name}
          onChangeText={setName}
          placeholder="Property Name"
        />

        <Text style={styles.labelText}>Property Value</Text>
        <FormInput
          value={value}
          onChangeText={setValue}
          placeholder="Property Value"
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

export default EditPropertyForm;

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
  form: {
    width: '100%',
  },
  labelText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
});
