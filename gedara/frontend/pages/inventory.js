import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Template from '../pages/template';
import Card from '../components/card';
import { Provider as PaperProvider, Text, Surface, IconButton } from 'react-native-paper';
import { theme } from '../theme';
import MenuButton from '../components/MenuButton';
import HomeModal from './creation-pages/homeModal';
import RoomModal from './creation-pages/roomModal';
import ItemModal from './creation-pages/itemModal';

export default function Inventory({ navigation }) {
  const { colors } = theme;
  const [selectedModal, setSelectedModal] = useState(null);

  const handleMenuSelect = (option) => {
    setSelectedModal(option);
  };

  return (
    <Template navigation={navigation}>
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <Text style={[styles.headers]}>Main Home</Text>

        <Card width={300} height={100} style={{ marginBottom: 10 }}>
          Main Property
        </Card>

        <Text style={[styles.headers]}>Homes</Text>

        <ScrollView style={[styles.properties]}>
          <Card width={300} height={100} style={{ marginVertical: 10 }}>
            Property 1
          </Card>
          <Card width={300} height={100} style={{ marginVertical: 10 }}>
            Property 2
          </Card>
          <Card width={300} height={100} style={{ marginVertical: 10 }}>
            Property 3
          </Card>
        </ScrollView>

      </View>
    </Template>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    maxHeight: "auto",
  },
  headers: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: "#fff",
  },
  properties: {
    flexGrow: 1,
    maxHeight: 350,
    flexDirection: 'column',
    width: '100%',
  },
});