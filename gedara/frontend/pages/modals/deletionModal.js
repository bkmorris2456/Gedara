import React from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';

const DeletionModal = ({ visible, onCancel, onConfirm, elementType = 'item' }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Confirm Deletion</Text>
          <Text style={styles.modalText}>
            Are you sure you want to delete this {elementType}?
          </Text>
          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={onCancel} color="gray" />
            <Button title="Delete" onPress={onConfirm} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeletionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    padding: 20,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
