import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useColorScheme, TextInput } from 'react-native';
import { Provider as PaperProvider, Surface, Button } from 'react-native-paper';
import Template from '../pages/template';
import Card from '../components/card';
import { auth } from '../../config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login({ navigation, children }) {

    const [email, onChangeEmail] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Login successful!');
            navigation.navigate('Home'); // redirect user here
            // redirect user here
        } catch (error) {
            switch (error.code) {
                case 'auth/user-not-found':
                    alert("No user found with this email.");
                    break;
                case 'auth/wrong-password':
                    alert("Incorrect password.");
                    break;
                case 'auth/invalid-email':
                    alert("The email address is badly formatted.");
                    break;
                default:
                    alert('Login failed: ' + error.message);
            }        }
    };

    return (
        <Template navigation={navigation}>

            <View style={styles.intro_text}>
                <Text style={styles.intro_text}>Welcome to Gedara</Text>
            </View>

            <Card style={[StyleSheet.login_container]} width="100%" height={600}>

                <View style={styles.info_organizer}>

                    <Text style={styles.login_text}>Login</Text>
                    <Text>Email</Text>
                    <TextInput style={styles.input} onChangeText={onChangeEmail} value={email} />
                    <Text>Password</Text>
                    <TextInput style={styles.input} onChangeText={onChangePassword} value={password} />

                    <Button
                    mode="contained"
                    onPress={() => signIn()}
                    style={styles.save}
                    >
                        Save
                    </Button>

                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('Signup')}
                        style={styles.signup_button}
                    >
                        Sign Up
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
        autoCapitalize: 'none',
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