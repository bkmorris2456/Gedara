import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useColorScheme, TextInput } from 'react-native';
import { Provider as PaperProvider, Surface, Button } from 'react-native-paper';
import Template from '../pages/template';
import Card from '../components/card';

export default function Login({ navigation }) {

    const [email, onChangeEmail] = React.useState('Email');
    const [password, onChangePassword] = React.useState('Password');
    const [name, onChangeName] = React.useState('Name');

    return (
        <Template navigation={navigation}>

            <View style={styles.intro_text}>
                <Text style={styles.intro_text}>Welcome to Gedara</Text>
            </View>

            <Card style={[StyleSheet.login_container]} width="100%" height={500}>

                <View style={styles.info_organizer}>

                    <Text style={styles.login_text}>Sign Up!</Text>
                    <TextInput style={styles.input} onChangeText={onChangeName} value={name} />
                    <TextInput style={styles.input} onChangeText={onChangeEmail} value={email} />
                    <TextInput style={styles.input} onChangeText={onChangePassword} value={password} />

                    <Button
                    mode="contained"
                    onPress={() => console.log("Save pressed")}
                    style={styles.save}
                    >
                        Sign Up
                    </Button>

                    <Button
                        mode="contained"
                        onPress={() => console.log("Login Pressed")}
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
        width: '275',
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