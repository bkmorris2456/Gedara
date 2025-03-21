import React, { useState } from 'react';
import { View } from 'react-native';
import { Menu, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';

const MenuButton = ({ onSelect }) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10 }}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<IconButton icon="menu" size={24} onPress={openMenu} iconColor={theme.colors.text} />}
      >
        <Menu.Item onPress={() => { closeMenu(); onSelect('Home'); }} title="Home" />
        <Menu.Item onPress={() => { closeMenu(); onSelect('Room'); }} title="Room" />
        <Menu.Item onPress={() => { closeMenu(); onSelect('Item'); }} title="Item" />
      </Menu>
    </View>
  );
};

export default MenuButton;
