import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Pressable, Dimensions, Image } from 'react-native';
import Template from '../pages/template';
import { Text } from 'react-native-paper';
import { theme } from '../theme';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config';

const screenWidth = Dimensions.get('window').width;

export default function Settings({ navigation }) {
  const { colors } = theme;
  const auth = getAuth();

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
      const fetchUserData = async () => {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserName(data.name || 'No name available');
          } else {
            console.log('No such user document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }
  }, []);

  const changeSettings = () => {
    console.log('Change Settings button pressed');
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => console.log('User signed out'))
      .catch(error => console.error('Logout error:', error));
  };

  return (
    <Template navigation={navigation}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headers}>Settings</Text>

        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <View style={styles.pictureFrame}>
            <Image
              source={require('../../assets/generic-profile-icon-10.jpg.png')}
              style={{ width: '100%', height: '100%', borderRadius: 55, }}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.userText}>{userName}</Text>
            <Text style={styles.userText}>{userEmail}</Text>
          </View>
        </View>

        {/* Change Settings */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.changeSettingsButton} onPress={changeSettings}>
            <Text style={styles.changeSettingsText}>Change Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <Pressable onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </Template>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  },
  headers: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 30,
  },
  pictureFrame: {
    width: 110,
    height: 110,
    backgroundColor: '#fff',
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginLeft: 20,
    flex: 1,
  },
  userText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  changeSettingsButton: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
  },
  changeSettingsText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },
});
