import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // adjust path as needed
import Template from './template'; // or wherever your Template component is located

const ChangeSettings = ({ navigation }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [name, setName] = useState('');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    // Fetch Firestore name here if needed
    // Or pre-fill from route params if you passed the data from previous screen
  }, []);

  const handleUpdate = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { name });

      // Optionally update email in auth if allowed
      // await updateEmail(user, email);

      console.log('Profile updated');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Template navigation={navigation}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <Text style={styles.header}>Update Your Info</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#aaa"
        />

        <TextInput
          style={styles.input}
          placeholder="Email (disabled)"
          value={email}
          editable={false}
          placeholderTextColor="#aaa"
        />

        <Button mode="contained" onPress={handleUpdate} style={styles.button}>
          Save Changes
        </Button>
      </KeyboardAvoidingView>
    </Template>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    marginTop: 10,
  },
});

export default ChangeSettings;
