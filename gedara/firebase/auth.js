import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore';
import {auth, db} from './config';

// Register a new user
export const registerUser = async (email, password, name, username) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update the user's profile with the name
        await updateProfile(user, {displayName: name});

        // Save additional user information in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            username: username,
            email: email,
            name: name,
            createdAt: new Date(),
        });

        return { user };
    } catch (error) {
        console.error('Error registering user:', error);
        return { error: error.message };
    }
};

// Login user
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return { user };
    } catch (error) {
        console.error('Error logging in user:', error);
        return { error: error.message };
    }
}

// Sign out
export const signOut = async () => {
    try {
        await firebaseSignOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Error signing out:', error);
        return { error: error.message };
    }
};

// Listen to auth state changes
export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
    return auth.currentUser;
};