// src/screens/Homes.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { getCurrentUser, getUserHomes, createHome } from '../firebase';

export default function HomesScreen({ navigation }) {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHomeName, setNewHomeName] = useState('');
  
  const fetchHomes = async () => {
    setLoading(true);
    try {
      const user = getCurrentUser();
      if (!user) {
        navigation.navigate('Login');
        return;
      }
      
      const { homes, error } = await getUserHomes(user.uid);
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setHomes(homes || []);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchHomes();
    
    // Set up navigation listener to refresh data when screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHomes();
    });
    
    return unsubscribe;
  }, [navigation]);
  
  const handleAddHome = async () => {
    if (!newHomeName.trim()) {
      Alert.alert('Error', 'Please enter a home name');
      return;
    }
    
    try {
      const user = getCurrentUser();
      if (!user) {
        navigation.navigate('Login');
        return;
      }
      
      const { homeId, error } = await createHome(user.uid, {
        name: newHomeName.trim()
      });
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setNewHomeName('');
        setShowAddForm(false);
        fetchHomes();
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.homeItem}
      onPress={() => navigation.navigate('HomeDetails', { homeId: item.id })}
    >
      <Text style={styles.homeName}>{item.name}</Text>
      <View style={styles.homeStats}>
        <Text>Rooms: {item.totalRooms || 0}</Text>
        <Text>Items: {item.totalItems || 0}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Homes</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Text style={styles.addButtonText}>
            {showAddForm ? 'Cancel' : 'Add Home'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {showAddForm && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Home Name"
            value={newHomeName}
            onChangeText={setNewHomeName}
          />
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleAddHome}
          >
            <Text style={styles.submitButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {loading ? (
        <Text style={styles.loadingText}>Loading homes...</Text>
      ) : homes.length === 0 ? (
        <Text style={styles.emptyText}>
          You don't have any homes yet. Add your first home!
        </Text>
      ) : (
        <FlatList
          data={homes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addForm: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  homeItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  homeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  homeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
    paddingHorizontal: 30,
  },
});