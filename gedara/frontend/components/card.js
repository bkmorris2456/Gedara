import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Card = ({ width, height, children, style, variant = 'dark', onPress }) => {
  const isChildCard = variant === 'light';

  const CardContent = (
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
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
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
    // flexDirection: 'space-between' is invalid, use 'row' or 'column' instead if needed
  },
  text: { color: '#fff' },
});

export default Card;
