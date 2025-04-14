import { db } from '../../config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useColorScheme, TextInput } from 'react-native';
import { Provider as PaperProvider, Surface, Button } from 'react-native-paper';
import Template from '../pages/template';
import Card from '../components/card';


export default function Signup({ navigation }) {

    const todoRef = collection(db, 'users');
    const [email, onChangeEmail] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [name, onChangeName] = React.useState('');

    const addUser = async () => {
        if (name && email && password) {
            try {
                await addDoc(todoRef, {
                    name,
                    email,
                    password,
                    createdAt: serverTimestamp(),
                });
                onChangeName('');
                onChangeEmail('');
                onChangePassword('');
            } catch (error) {
                alert(error.message);
            }
        } else {
            alert("Please fill out all fields.");
        }
    };

    return (
        <Template navigation={navigation}>

            <View style={styles.intro_text}>
                <Text style={styles.intro_text}>Welcome to Gedara</Text>
            </View>

            <Card style={[StyleSheet.login_container]} width="100%" height={500}>

                <View style={styles.info_organizer}>

                    <Text style={styles.login_text}>Sign Up!</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Full Name"
                        value={name}
                        onChangeText={(text) => onChangeName(text)}
                        multiline={false}
                        underlineColorAndroid={'transparent'}
                        autoCapitalize='none'
                    />
                    <TextInput 
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={(text) => onChangeEmail(text)}
                        multiline={false}
                        underlineColorAndroid={'transparent'}
                        autoCapitalize='none'
                    />
                    <TextInput 
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={(text) => onChangePassword(text)}
                        secureTextEntry={true}
                        multiline={false}
                        underlineColorAndroid={'transparent'}
                        autoCapitalize='none'
                    />

                    <Button
                    mode="contained"
                    onPress={addUser}
                    style={styles.save}
                    >
                        Sign Up
                    </Button>

                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('Login')}
                        style={styles.signup_button}
                    >
                        Back to Login
                    </Button>


                </View>

            </Card>
            
        </Template>
    );
};

const styles = StyleSheet.create({
    intro_text: {
        display: 'flex',
        padding: 20,
        marginBottom: 10,
        color: "#fff",
        alignItems: 'center',
        fontSize: 24,
    },
    login_container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    info_organizer: {
        padding: 20,
        marginBottom: 25,
        color: '#fff',
    },
    input: {
        height: 40,
        marginVertical: 20,
        borderWidth: 1,
        borderColor: "#fff",
        padding: 10,
        color: '#fff',
        width: 275,
    },
    login_text: {
        display: 'flex',
        color: '#fff',
        fontSize: 24,
        marginBottom: 20,
        justifyContent: 'center',
    },
    save: {
        width: "100%",
        height: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
        marginTop: 20,
    },
    signup_button: {
        width: "100%",
        height: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
});