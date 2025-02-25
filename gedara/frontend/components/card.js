import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = ({ width, height, children, style }) => {
  return (
    <View style={[styles.card, { width, height }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e1e', // Dark mode background
    borderRadius: 15, // Rounded edges
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Shadow effect for Android
  },
});

export default Card;
