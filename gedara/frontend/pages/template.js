import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider as PaperProvider, Text, Surface } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '../theme';

// Import MenuButton and associated modals
import MenuButton from '../components/MenuButton';
import HomeModal from './modals/homeModal';
import RoomModal from './modals/roomModal';
import ItemModal from './modals/itemModal';

// Static assets
const logo = require('../../assets/favicon.png');
const Tab = createBottomTabNavigator();

// Template component wraps each screen with header and modals
const Template = ({ children, navigation, onHomeAdded }) => {
  const { colors } = theme;
  const [selectedModal, setSelectedModal] = useState(null); // Track which modal is open

  // Handle selection from the header menu
  const handleMenuSelect = (option) => {
    setSelectedModal(option);
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.primary }]}>

        {/* Header Bar */}
        <Surface style={[styles.header, { backgroundColor: colors.primary }]} elevation={4}>

          {/* App Logo */}
          <Image source={logo} style={styles.logo} />

          {/* Center title that redirects back to home screen */}
          <TouchableOpacity onPress={() => {
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
          }}>
            <Text variant="titleLarge" style={[styles.title, { color: colors.text }]}>Gedara</Text>
          </TouchableOpacity>
          
          {/* Right side menu button */}
          <MenuButton onSelect={handleMenuSelect} />
        </Surface>

        {/* Main Content */}
        <View style={[styles.content, { backgroundColor: colors.primary }]}>
          {children}

          {/* Modals */}
          <HomeModal 
            visible={selectedModal === 'Home'} 
            onClose={() => setSelectedModal(null)}
          />
          <RoomModal 
            visible={selectedModal === 'Room'} 
            onClose={() => setSelectedModal(null)} 
          />
          <ItemModal 
            visible={selectedModal === 'Item'} 
            onClose={() => setSelectedModal(null)} />
        </View>

      </SafeAreaView>
    </PaperProvider>
  );
};

// Template Styling
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
