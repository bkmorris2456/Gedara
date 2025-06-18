import React, { useState } from 'react';
import { View, StyleSheet, Alert, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config';
import { theme } from '../theme';
import FormInput from '../components/FormInput'; // reusable input
import Template from '../pages/template';

// Import different template forms for user input when editing elements
import EditPropertyForm from '../pages/modals/EditPropertyForm';
import EditRoomForm from '../pages/modals/EditRoomForm';
import EditItemForm from '../pages/modals/EditItemForm';

const EditElement = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { elementType, data } = route.params;
  const { colors } = theme;

  const [name, setName] = useState(data?.propName || data?.roomName || data?.itemName || '');
  const [quantity, setQuantity] = useState(data?.quantity?.toString() || '');
  const [estValue, setEstValue] = useState(
    data?.propValue?.toString() || data?.estVal?.toString() || ''
  );

  const renderForm = () => {

    switch (elementType) {
      case 'property':
        return <EditPropertyForm data={data} onSubmit={handleUpdate}/>;
      case 'room':
        return <EditRoomForm data={data} onSubmit={handleUpdate}/>;
      case 'item':
        return <EditItemForm data={data} onSubmit={handleUpdate}/>;
      default:
        return null;
    }

  }

  const handleUpdate = async () => {
    const updates = {};
    if (elementType === 'property') updates.propName = name;
    if (elementType === 'room') updates.roomName = name;
    if (elementType === 'item') {
      updates.itemName = name;
      updates.quantity = parseInt(quantity);
    }
    updates.estVal = parseFloat(estValue);
    if (elementType === 'property') updates.propValue = parseFloat(estValue);

    try {
      const ref = doc(db, `${elementType}s`, data.id);
      await updateDoc(ref, updates);
      Alert.alert('Updated successfully!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error updating:', err.message);
    }
  };

  return (
    <Template>
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        {(elementType === 'property' || elementType === 'room') && (
          <FormInput
            value={name}
            onChangeText={setName}
            placeholder={`${elementType === 'property' ? 'Property' : 'Room'} Name`}
          />
        )}

        {elementType === 'item' && (
          <>
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
          </>
        )}

        <FormInput
          value={estValue}
          onChangeText={setEstValue}
          placeholder="Estimated Value"
          keyboardType="numeric"
        />

        <View style={styles.buttonRow}>
          <Button title="Cancel" onPress={() => navigation.goBack()} color="red" />
          <Button title="Save Changes" onPress={handleUpdate} />
        </View>
      </View>
    </Template>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default EditElement;
