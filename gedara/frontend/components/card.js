import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Card = ({
  width,
  height,
  title,
  type,
  onEdit,
  onDelete,
  children,
  style,
  variant = 'dark',
  onPress,
}) => {
  const isChildCard = variant === 'light';

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
        style,
      ]}
    >
      {/* Top Row */}
      <View style={styles.rowTop}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.typeText}>{type}</Text>
      </View>

      {/* Optional child content */}
      <View style={styles.childrenContainer}>{children}</View>

      {/* Bottom Right Actions */}
      {(onEdit || onDelete) && (
        <View style={styles.actionsContainer}>
          {onEdit && (
            <Text style={styles.actionText} onPress={onEdit}>
              Edit
            </Text>
          )}
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
