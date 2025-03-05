import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Card = ({ width, height, children, style, variant = 'dark' }) => {
  const isChildCard = variant === 'light';

  return (
    <View style={[
      styles.card, 
      { 
        width, 
        height, 
        backgroundColor: isChildCard ? '#2e2e2e' : '#1e1e1e',
        padding: isChildCard ? 10 : 15,
      }, 
      style
    ]}>
      {/* Ensures all direct text inside Card is white */}
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    display: 'flex',
    flexDirection: 'space-between',
  },
  text: { color: '#fff' }, // Default text color inside Card
});

export default Card;
