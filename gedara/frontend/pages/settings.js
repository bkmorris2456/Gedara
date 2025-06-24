import React from 'react';
import { View, StyleSheet, ScrollView, TextInput, Typography, Pressable, TouchableOpacity } from 'react-native';
import Template from '../pages/template';
import { Provider as PaperProvider, Text, Surface, Button } from 'react-native-paper';
import { theme } from '../theme';
import { getAuth, signOut } from 'firebase/auth';

// Seetings Screen
export default function Settings({ navigation }) {

  const { colors } = theme;
  const auth = getAuth();

  // Switches user to Change Settings page
  const changeSettings = () => {
    console.log('Button has been pressed!');
  };

  // Logs the user out and resets auth state
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out');
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  };

  // Render Settings screen
  return (
    <Template navigation={navigation}>

      <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false} // Hides the vertical scrollbar
      showsHorizontalScrollIndicator={false} // Hides the horizontal scrollbar
      >

        <Text style={styles.headers}>Settings</Text>

        <View style={styles.containerOne}>
          <View style={styles.pictureFrame}>
            <Text>Profile Picture Frame</Text>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.initialDisplay}>Insert Name Here</Text>
            <Text style={styles.initialDisplay}>Insert Email Here</Text>
          </View>
        </View>

        <View style={styles.containerTwo}>
          <TouchableOpacity style={styles.changeSettings} onPress={changeSettings}>
            <Text style={styles.changeSettingsText}>Change Settings</Text>
          </TouchableOpacity>
        </View>

        <Pressable onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </Pressable>

      </ScrollView>

    </Template>
  );
}

// Settings Screen Styling
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures the scroll view takes the full height
    paddingVertical: 20, // Adds spacing for better scrolling experience
    display: 'flex',
    alignItems: 'center',
  },
  containerOne: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'center',
  },
  containerTwo: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 50,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
    marginLeft: 25,
  },
  headers: {
    display: 'flex',
    fontSize: 36,
    marginVertical: 5,
    marginLeft: 10,
    color: '#ffffff',
    alignItems: 'left',
  },
  pictureFrame: {
    width: 125,
    height: 125,
    backgroundColor: '#fff',
    borderRadius: 62.5,
    marginVertical: 10,
    alignItems: 'center',
  },  
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  logout: {
    color: '#fff',
    alignItems: 'center',
    display: 'flex',
    marginTop: 155,
  },
  initialDisplay: {
    color: '#fff',
    fontSize: '20px',
    margin: 10,
  },
  changeSettings: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '60%',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  changeSettingsText: {
    color: '#fff',
    fontSize: 16,
  }
})