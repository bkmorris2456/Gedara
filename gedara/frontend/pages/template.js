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
import HomeModal from './creation-pages/homeModal';
import RoomModal from './creation-pages/roomModal';
import ItemModal from './creation-pages/itemModal';

// Placeholder logo
const logo = require('../../assets/favicon.png');
const Tab = createBottomTabNavigator();

const Template = ({ children, navigation, onHomeAdded }) => {
  const { colors } = theme;

  const [selectedModal, setSelectedModal] = useState(null);

  const handleMenuSelect = (option) => {
    setSelectedModal(option);
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.primary }]}>
        
        {/* Header Bar */}
        <Surface style={[styles.header, { backgroundColor: colors.primary }]} elevation={4}>
          <Image source={logo} style={styles.logo} />

          <TouchableOpacity onPress={() => {
            // Reset the navigation stack and navigate to "Home"
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          }}>
            <Text variant="titleLarge" style={[styles.title, { color: colors.text }]}>
              Gedara
            </Text>
          </TouchableOpacity>
          
          {/* original profile Icon to go to login page */}
          {/* <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Ionicons name="person-circle-outline" size={30} color={colors.text} style={styles.icon} />
          </TouchableOpacity> */}
          <MenuButton onSelect={handleMenuSelect} />
        </Surface>

        {/* Main Content */}
        <View style={[styles.content, { backgroundColor: colors.primary }]}>
          {children}
          {/* Modals */}
          <HomeModal 
            visible={selectedModal === 'Home'} 
            onClose={() => setSelectedModal(null)}
            onHomeAdded={onHomeAdded}
          />
          <RoomModal visible={selectedModal === 'Room'} onClose={() => setSelectedModal(null)} />
          <ItemModal visible={selectedModal === 'Item'} onClose={() => setSelectedModal(null)} />
        </View>

      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',  // Ensures vertical alignment
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,  // Reduce vertical padding to shrink height
    height: 60,  // Set explicit height to reduce header size
  },
  logo: { width: 40, height: 40, resizeMode: 'contain' },
  title: { 
    flex: 1,  
    textAlign: 'center',
    fontSize: 20,  // Slightly adjust font size for better balance
    fontWeight: 'bold',
  },
  icon: { marginRight: 10 },
  content: { flex: 1, padding: 20, marginTop: 10 },
});

export default Template;
