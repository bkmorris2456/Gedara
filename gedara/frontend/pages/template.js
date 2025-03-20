import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Provider as PaperProvider, Text, Surface } from 'react-native-paper';
import { theme } from '../theme';

// Placeholder logo
const logo = require('../../assets/favicon.png');

const Template = ({ children, navigation }) => {
  const { colors } = theme;

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.primary }]}>
        
        {/* Header Bar */}
        <Surface style={[styles.header, { backgroundColor: colors.primary }]} elevation={4}>
          <Image source={logo} style={styles.logo} />
          <Text variant="titleLarge" style={[styles.title, { color: colors.text }]}>
            Gedara
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Ionicons name="person-circle-outline" size={30} color={colors.text} style={styles.icon} />
          </TouchableOpacity>
        </Surface>

        {/* Main Content */}
        <View style={[styles.content, { backgroundColor: colors.primary }]}>
          {children}
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
    padding: 15,
  },
  logo: { width: 40, height: 40, resizeMode: 'contain' },
  title: { flex: 1, textAlign: 'center' },
  icon: { marginRight: 10 },
  content: { flex: 1, padding: 20, marginTop: 10 },
});

export default Template;
