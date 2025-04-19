import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    useColorScheme, 
    TextInput,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
} from 'react-native';
import { Provider as PaperProvider, Surface, Button } from 'react-native-paper';
import Card from '../components/card';
import { auth } from '../../config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login({ navigation, children }) {

    const [email, onChangeEmail] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    // Function that handles verification of user login using given data
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

                                    <Text style={styles.login_text}>Login</Text>
                                    <Text style={styles.text}>Email</Text>
                                    <TextInput style={styles.input} onChangeText={onChangeEmail} value={email} />
                                    <Text style={styles.text}>Password</Text>
                                    <TextInput style={styles.input} onChangeText={onChangePassword} value={password} />

                                    <Button
                                    mode="contained"
                                    onPress={() => signIn()}
                                    style={styles.save}
                                    >
                                        Login
                                    </Button>

                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                                        <Text style={styles.text}>Don't have an account? </Text>
                                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                            <Text style={[styles.text, { color: '#1079AA' }]}>Sign Up</Text>
                                        </TouchableOpacity>
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
        width: '100%',
        
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
    text: {
        color: '#fff',
    }
});