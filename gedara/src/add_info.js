// Imports
import { db } from '../../config'; // Import database
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    TextInput
} from 'react-native';
import { Button } from 'react-native-paper';
import Template from '../pages/template';
import Card from '../components/card';

// Following example is from signup.js
export default function Signup({ navigation }) {
    const todoRef = collection(db, 'users'); // variable that determines that information we'll be added to users document
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
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.intro_text}>
                            <Text style={styles.intro_text}>Welcome to Gedara</Text>
                        </View>

                        <Card style={styles.login_container} width="100%">
                            <View style={styles.info_organizer}>
                                <Text style={styles.login_text}>Sign Up!</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    value={name}
                                    onChangeText={onChangeName}
                                    autoCapitalize='none'
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    value={email}
                                    onChangeText={onChangeEmail}
                                    autoCapitalize='none'
                                    keyboardType="email-address"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={onChangePassword}
                                    secureTextEntry
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
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Template>
    );
};

const styles = StyleSheet.create({
    intro_text: {
        padding: 20,
        marginBottom: 10,
        color: "#fff",
        alignItems: 'center',
        fontSize: 24,
        textAlign: 'center',
    },
    login_container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    info_organizer: {
        width: '100%',
    },
    input: {
        height: 40,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: "#fff",
        padding: 10,
        color: '#fff',
        width: '100%',
    },
    login_text: {
        color: '#fff',
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    save: {
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
        marginTop: 20,
    },
    signup_button: {
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
});
