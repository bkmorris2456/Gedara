import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config';
import { theme } from '../theme';
import Template from '../pages/template';

// Import dynamic forms
import EditPropertyForm from '../pages/modals/EditPropertyForm';
import EditRoomForm from '../pages/modals/EditRoomForm';
import EditItemForm from '../pages/modals/EditItemForm';

const EditElement = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { elementType, data } = route.params;
  const { colors } = theme;

  const collectionMap = {
    property: 'properties',
    room: 'rooms',
    item: 'items',
  };

  const handleUpdate = async (updates) => {
    if (!updates || Object.keys(updates).length === 0) {
      Alert.alert('No changes to update');
      return;
    }

    // Remove any fields that are NaN or undefined
    const sanitizedUpdates = {};
    for (const key in updates) {
      const val = updates[key];
      if (val !== undefined && !Number.isNaN(val)) {
        sanitizedUpdates[key] = val;
      }
    }

    try {
      const ref = doc(db, collectionMap[elementType], data.id);
      await updateDoc(ref, sanitizedUpdates);
      Alert.alert('Updated successfully!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error updating:', err.message);
    }
  };

  const renderForm = () => {
    switch (elementType) {
      case 'property':
        return <EditPropertyForm data={data} onSubmit={handleUpdate} />;
      case 'room':
        return <EditRoomForm data={data} onSubmit={handleUpdate} />;
      case 'item':
        return <EditItemForm data={data} onSubmit={handleUpdate} />;
      default:
        return null;
    }
  };

  return (
    <Template>
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        {renderForm()}
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
});

export default EditElement;
