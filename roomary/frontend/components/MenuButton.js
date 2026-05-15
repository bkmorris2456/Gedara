import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Menu, IconButton } from 'react-native-paper'; // UI components from React Native Paper
import { useNavigation } from '@react-navigation/native'; // (Imported but not used – can be removed)
import { theme } from '../theme'; // Custom theme with colors

// A floating menu button that allows users to add a Property, Room, or Item
const MenuButton = ({ onSelect }) => {
  const [visible, setVisible] = useState(false); // Controls menu visibility

  // Open and close handlers for the dropdown menu
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10 }}>
      {/* Menu component anchored to a "+" icon button */}
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon="plus"
            size={24}
            onPress={openMenu}
            iconColor={theme.colors.text}
            style={styles.menu}
          />
        }
      >
        {/* Menu options trigger the onSelect callback with the respective modal key */}
        <Menu.Item
          onPress={() => {
            closeMenu();
            onSelect('Home');
          }}
          title="Add Property"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            onSelect('Room');
          }}
          title="Add Room"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            onSelect('Item');
          }}
          title="Add Item"
        />
      </Menu>
    </View>
  );
};

// Optional styling for the menu icon button
const styles = StyleSheet.create({
  menu: {
    backgroundColor: 'transparent',
  },
});

export default MenuButton;
