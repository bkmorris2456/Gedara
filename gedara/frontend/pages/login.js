import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useColorScheme, TextInput } from 'react-native';
import Template from '../pages/template';
import Card from '../components/card';

export default function Login({ navigation }) {

    const [email, onChangeEmail] = React.useState('Email');
    const [password, onChangePassword] = React.useState('Password');

    return (
        <Template navigation={navigation}>

        <View style={styles.intro_text}>
            <Text>Welcome to Gedara!</Text>
            <Text>Your official tool for managing your home!</Text>
        </View>

        <Card style={[StyleSheet.login_container]} width="100%" height={450}>

            <View style={styles.info_organizer}>

                <Text style={styles.text_color}>Account Login</Text>
                <TextInput style={styles.input} onChangeText={onChangeEmail} value={email} />
                <TextInput style={styles.input} onChangeText={onChangePassword} value={password} />


            </View>

        </Card>
        </Template>
    );
};

const styles = StyleSheet.create({
    intro_text: {
        padding: 20,
        marginBottom: 10,
        color: "#fff"
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
        margin: 12,
        borderWidth: 1,
        borderColor: "#fff",
        padding: 10,
        color: '#fff',
        width: '275',
    },
    text_color: {
        color: '#fff',
    },
});