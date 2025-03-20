import React from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import Template from '../pages/template';
import { Provider as PaperProvider, Text, Surface } from 'react-native-paper';
import { theme } from '../theme';

export default function Settings({ navigation }) {

  const { colors } = theme;

  return (
    <Template navigation={navigation}>
      
      <View style={[styles.main_container, { backgroundColor: colors.primary }]}>

        <Text style={styles.headers}>User Settings</Text>

        <View style={[styles.pic, { width: 100, height: 100, borderRadius: 100 / 2 }]}>
          {/* <Image source={source} style={[styles.image, { width: , height: size, borderRadius: size / 2 }]} /> */}
          <Text>Profile Pic</Text>
        </View>

        <View style={[styles.settings_form, { backgroundColor: colors.primary }]}>

          <TextInput style={[styles.inputs]}>
            Full Name
          </TextInput>

          <TextInput style={[styles.inputs]}>
            Email
          </TextInput>

          <TextInput style={[styles.inputs]}>
            Password
          </TextInput>


        </View>

      </View>

    </Template>
  );
}

const styles = StyleSheet.create({
  main_container: {
    height: "auto",
    flex: 1,
    padding: 10,

  },
  headers: {
    fontSize: 24,
    marginVertical: 5,
    color: '#ffffff',
  },
  pic: {
    overflow: 'hidden',
    backgroundColor: '#fff'
  },
  settings_form: {
    width: '350',
    height: 'auto',
  },
  inputs: {
    height: 50,
    margin: 15,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    color: '#fff'
  }
})