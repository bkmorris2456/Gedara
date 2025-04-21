import React from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import Template from '../pages/template';
import { Provider as PaperProvider, Text, Surface, Button } from 'react-native-paper';
import { theme } from '../theme';
import { getAuth, signOut } from 'firebase/auth';

export default function Settings({ navigation }) {

  const { colors } = theme;
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out');
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  };

  return (
    <Template navigation={navigation}>
      
      <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false} // Hides the vertical scrollbar
      showsHorizontalScrollIndicator={false} // Hides the horizontal scrollbar
      >

        <Text style={styles.headers}>User Settings</Text>

        <View style={[styles.pic, { width: 100, height: 100, borderRadius: 100 / 2 }]}>
          {/* <Image source={source} style={[styles.image, { width: , height: size, borderRadius: size / 2 }]} /> */}
          <Text style={{justifyContent: "center", alignItems: "center", display: "flex"}}>Profile Pic</Text>
        </View>

        <View style={[styles.settings_form, { backgroundColor: colors.primary }]}>

          <View style={styles.inputContainers}>

            <Text style={styles.inputLabels}>Full Name</Text>
            <TextInput style={[styles.inputs]}>

            </TextInput>

          </View>


          <View style={styles.inputContainers}>

            <Text style={styles.inputLabels}>Email</Text>
            <TextInput style={[styles.inputs]}>

            </TextInput>

          </View>

          <View style={styles.inputContainers}>

            <Text style={styles.inputLabels}>Password</Text>
            <TextInput style={[styles.inputs]}>

            </TextInput>

          </View>

          <View style={styles.buttonContainer}>

            <Button
              mode="contained"
              onPress={() => console.log("Save pressed")}
              style={styles.save}
            >
              <Text>Save Changes</Text>
            </Button>

          </View>

        </View>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Signup')}
          style={styles.save}
        >
          <Text>Navigate to Signup</Text>
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          style={styles.save}
        >
          <Text>Navigate to Login</Text>
        </Button>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.save}
        >
          <Text>Logout/Switch Account</Text>
        </Button>

      </ScrollView>

    </Template>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures the scroll view takes the full height
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20, // Adds spacing for better scrolling experience
  },
  headers: {
    fontSize: 24,
    marginVertical: 5,
    color: '#ffffff',
  },
  pic: {
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginVertical: 20,
  },
  settings_form: {
    width: '350',
    height: 'auto',
    alignItems: 'center',
  },
  inputs: {
    height: 40,
    width: 300,
    margin: 15,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    color: '#fff'
  },
  inputLabels: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 20,
  },
  inputContainers: {
    marginVertical: 2,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  save: {
    width: "75%",
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    backgroundColor: "white",
    borderRadius: 2,
    color: '#000',
  }
})