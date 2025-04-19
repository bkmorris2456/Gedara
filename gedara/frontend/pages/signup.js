import { auth, db } from '../../config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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
import { Button, PaperProvider } from 'react-native-paper';
import Card from '../components/card';

export default function Signup({ navigation }) {
    const [email, onChangeEmail] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [name, onChangeName] = React.useState('');

    const addUser = async () => {

        if (name && email && password) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log('User registered:');

                await addDoc(collection(db, 'users'), {
                    uid: user.uid,
                    name,
                    email,
                    password,
                    createdAt: serverTimestamp(),
                });

                alert('Account created!');
                onChangeEmail('');
                onChangePassword('');
                onChangeName('');
                navigation.navigate('Login');
            } catch (error) {
                alert("Signup failed: " + error.message);
            }
        } else {
            alert("Please fill in all fields.");
        }

    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <TouchableWithoutFeedback
                    onPress={() => {
                        if (Platform.OS !== 'web') {
                        Keyboard.dismiss();
                        }
                    }}
                    >
                        <View style={{ flex: 1 }}>
                            <View style={styles.intro_text}>
                                <Text style={styles.intro_text}>Welcome to Gedara</Text>
                            </View>

                            <Card style={styles.login_container} width="100%">
                                <View style={styles.info_organizer}>
                                    <Text style={styles.login_text}>Sign Up!</Text>

                                    <Text style={{ color: '#fff' }}>Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={name}
                                        onChangeText={onChangeName}
                                        autoCapitalize='none'
                                    />
                                    <Text style={{ color: '#fff' }}>Email</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={email}
                                        onChangeText={onChangeEmail}
                                        autoCapitalize='none'
                                    />
                                    <Text style={{ color: '#fff' }}>Password</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={password}
                                        onChangeText={onChangePassword}
                                        secureTextEntry={true}
                                        autoCapitalize='none'
                                    />

                                    <Button
                                        mode="contained"
                                        onPress={addUser}
                                        style={styles.save}
                                    >
                                        Sign Up
                                    </Button>

                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                                        <Text style={styles.text}>Already have an account? </Text>
                                        <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}>
                                            <Text style={[styles.text, { color: '#1079AA' }]}>Login</Text>
                                        </TouchableWithoutFeedback>
                                    </View>

                                </View>
                            </Card>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
        justifyContent: 'center',
    },
    intro_text: {
        padding: 20,
        marginBottom: 5,
        marginTop: 50,
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
        backgroundColor: "white",
        marginTop: 20,
        borderRadius: 2,
        color: '#000',
        width: '100%',
    },
    signup_button: {
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    text: {
        color: '#fff',
    },
});
