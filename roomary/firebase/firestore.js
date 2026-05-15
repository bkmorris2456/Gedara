import {
    collection,
    doc,
    setDoc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './config'; // Firebase Firestore instance

// ==========================
// 🔹 User Data Operations
// ==========================

// Fetch a user's data by their userId
export const getUserData = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId)); // Reference to the user document

        if (userDoc.exists()) {
            // Return user data if found
            return { userData: { id: userDoc.id, ...userDoc.data() } };
        }

        // If no user document exists, return an error message
        return { error: 'User not found' };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return { error: error.message };
    }
};

// Update a user's document with new data
export const updateUserData = async (userId, data) => {
    try {
        await updateDoc(doc(db, 'users', userId), data); // Update the specified user document
        return { success: true };
    } catch (error) {
        console.error('Error updating user data:', error);
        return { error: error.message };
    }
};

// ==========================
// 🔹 Home Data Operations
// ==========================

// Create a new home for a user
export const createHome = async (userId, homeData) => {
    try {
        const homeRef = collection(db, 'homes'); // Reference to the "homes" collection

        // Structure the home document with default metadata
        const newHomeData = {
            ...homeData,
            userId,             // Associate home with the user
            createdAt: serverTimestamp(), // Use JS Date instead of Firestore server timestamp
            totalRooms: 0,      // Initialize room count
            totalItems: 0       // Initialize item count
        };

        // Add document to Firestore and return its ID
        const docRef = await addDoc(homeRef, newHomeData);
        return { homeId: docRef.id };
    } catch (error) {
        console.error('Error creating home:', error);
        return { error: error.message };
    }
};
