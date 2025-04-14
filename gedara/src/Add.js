import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import React, { useState } from 'react';
import { firebase } from '../config';

const Home = () => {
    const todoRef = firebase.firestore().collection('newData');
    const [addData, setAddData] = useState('');

    // add a new field
    const addField = () => {
        // Check if we have new field data
        if (addData && addData.length > 0) {
            // Get the tiemstamp
            const timeStamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                heading: addData,
                createdAt: timestamp
            };
            toDoRef
                .add(data)
                .then(() => {
                    setAddData(''); // Clear the input field
                    Keyboard.dismiss(); // Dismiss the keyboard
                })
                .catch((error) => {
                    alert(error); // Show error message
                });
        }
    }

    return (
        <View style={{flex:1, justifyContent:'center'}}>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a new field"
                    value={addData}
                    onChangeText={(text) => setAddData(text)}
                    multiline={true}
                    underlineColorAndroid={'transparent'}
                    autoCapitalize='none'
                />
                <TouchableOpacity style={styles.button} onPress={addField}>
                    <Text style={{color:'white'}}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '90%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        width: '90%',
        height: 50,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});