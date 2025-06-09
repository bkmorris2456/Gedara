import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Provider as PaperProvider, Text, Surface } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '../theme';

// Import screens
import Home from '../pages/home';
import Inventory from '../pages/inventory';
import Profile from '../pages/settings';

// Import MenuButton and associated modals
import MenuButton from '../components/MenuButton';
import HomeModal from './modals/homeModal';
import RoomModal from './modals/roomModal';
import ItemModal from './modals/itemModal';
// import EditModal from './modals/editModal';

// Placeholder logo
const logo = require('../../assets/favicon.png');
const Tab = createBottomTabNavigator();

const Template = ({ children, navigation, onHomeAdded }) => {
  const { colors } = theme;
  const [selectedModal, setSelectedModal] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleMenuSelect = (option) => {
    setSelectedModal(option);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    const { id, type } = itemToDelete;
    let collectionName = '';
    if (type === 'Property') collectionName = 'properties';
    else if (type === 'Room') collectionName = 'rooms';
    else if (type === 'Item') collectionName = 'items';

    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(require('../../config').db, collectionName, id));
      console.log(`${type} deleted:`, id);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleteModalVisible(false);
      setItemToDelete(null);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.primary }]}>

        {/* Header Bar */}
        <Surface style={[styles.header, { backgroundColor: colors.primary }]} elevation={4}>
          <Image source={logo} style={styles.logo} />

          <TouchableOpacity onPress={() => {
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
          }}>
            <Text variant="titleLarge" style={[styles.title, { color: colors.text }]}>Gedara</Text>
          </TouchableOpacity>

          <MenuButton onSelect={handleMenuSelect} />
        </Surface>

        {/* Main Content */}
        <View style={[styles.content, { backgroundColor: colors.primary }]}>
          {React.cloneElement(children, {
            triggerDelete: (item) => {
              setItemToDelete(item);
              setDeleteModalVisible(true);
            },
          })}

          {/* Modals */}
          <HomeModal 
            visible={selectedModal === 'Home'} 
            onClose={() => setSelectedModal(null)}
            onHomeAdded={onHomeAdded}
          />
          <RoomModal visible={selectedModal === 'Room'} onClose={() => setSelectedModal(null)} />
          <ItemModal visible={selectedModal === 'Item'} onClose={() => setSelectedModal(null)} />
          {/* <EditModal
            visible={deleteModalVisible}
            onClose={() => setDeleteModalVisible(false)}
            onConfirm={handleConfirmDelete}
            title={`Delete ${itemToDelete?.type}`}
            message={`Are you sure you want to delete this ${itemToDelete?.type?.toLowerCase()}? This action cannot be undone.`}
          /> */}
        </View>

      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    height: 60,
  },
  logo: { width: 40, height: 40, resizeMode: 'contain' },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  icon: { marginRight: 10 },
  content: { flex: 1, padding: 20, marginTop: 10 },
});

export default Template;
