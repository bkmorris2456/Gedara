import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// A reusable Card component that supports customizable dimensions, styles, 
// click behavior, and optional edit/delete actions
const Card = ({
  width,          // Width of the card
  height,         // Height of the card
  title,          // Title text at the top left
  type,           // Type/label text at the top right
  onEdit,         // Optional edit action callback
  onDelete,       // Optional delete action callback
  children,       // Any nested content passed inside the card
  style,          // Optional style overrides
  variant = 'dark', // 'dark' or 'light' variant of card appearance
  onPress,        // Optional callback for when the card is pressed
}) => {

  // Check if the card is using a lighter style (for nested/child cards)
  const isChildCard = variant === 'light';

  // Core content of the card layout
  const CardContent = (
    <View
      style={[
        styles.card,
        {
          width,
          height,
          backgroundColor: isChildCard ? '#2e2e2e' : '#1e1e1e',
          padding: isChildCard ? 10 : 15,
        },
        style, // Allow for custom overrides
      ]}
    >
      
      {/* Top row with title and type */}
      <View style={styles.rowTop}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.typeText}>{type}</Text>
      </View>

      {/* Space for any nested components (e.g., detail rows, icons, etc.) */}
      <View style={styles.childrenContainer}>{children}</View>

      {/* Optional bottom-right text actions (Edit | Delete) */}
      {(onEdit || onDelete) && (
        <View style={styles.actionsContainer}>
          {onEdit && (
            <Text style={styles.actionText} onPress={onEdit}>
              Edit
            </Text>
          )}

          {/* Divider between actions */}
          {onEdit && onDelete && <Text style={styles.actionDivider}> | </Text>}
          {onDelete && (
            <Text style={styles.actionText} onPress={onDelete}>
              Delete
            </Text>
          )}
        </View>
      )}
    </View>
  );

  // If onPress is provided, wrap the card in a touchable element
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  // Default rendering without touch interaction
  return CardContent;
};

// Style definitions for the card and its sub-elements
const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'space-between',
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  typeText: {
    color: '#ccc',
    fontSize: 14,
    fontStyle: 'italic',
  },
  childrenContainer: {
    flex: 1,
    marginTop: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionText: {
    color: '#89CFF0',
    fontSize: 14,
  },
  actionDivider: {
    color: '#ccc',
    marginHorizontal: 5,
  },
});

export default Card;
