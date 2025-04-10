import {
    collection, doc, setDoc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query,
    where
} from 'firebase/firestore';
import {db} from './config';

// User operations
export const getUserData = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return { userData: {id: userDoc.id, ...userDoc.data()} };
        }
        return { error: 'User not found' };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return { error: error.message };
    }
};

export const updateUserData = async (userId, data) => {
    try {
        await updateDoc(doc(db, 'users', userId), data);
        return { success: true };
    } catch (error) {
        console.error('Error updating user data:', error);
        return { error: error.message };
    }
};

// Home operations
export const createHome = async (userId, homeData) => {
    try {
        const homeRef = await collection(db, 'homes');
        const newHomeData = {
            ...homeData,
            userId,
            createdAt: new Date(),
            totalRooms: 0,
            totalItems: 0,
        };

        const docRef = await addDoc(homeRef, newHomeData);
        return {homeId: docRef.id};
    } catch (error) {
        console.error('Error creating home:', error);
        return { error: error.message };
    }
};

