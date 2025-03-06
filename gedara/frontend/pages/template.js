import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Placeholder logo
const logo = require('../../assets/favicon.png');

const Template = ({ children, navigation }) => {
  const colorScheme = useColorScheme(); // Detect theme mode
  const isDarkMode = colorScheme === 'dark';

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      {/* Header Bar */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#1e1e1e' : '#eee' }]}>
        <Image source={logo} style={styles.logo} />
        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Gedara</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Ionicons name="person-circle-outline" size={24} color={isDarkMode ? '#fff' : '#000'} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={[styles.content, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  logo: { width: 40, height: 40, resizeMode: 'contain' },
  title: { fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  icon: { marginRight: 10 },
  content: { flex: 1, padding: 20 },
});

export default Template;
