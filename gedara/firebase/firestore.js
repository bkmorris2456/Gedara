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

export const getUserHomes = async (userId) => {
    try {
      const homesQuery = query(collection(db, 'homes'), where('userId', '==', userId));
      const querySnapshot = await getDocs(homesQuery);
      const homes = [];
      
      querySnapshot.forEach((doc) => {
        homes.push({ id: doc.id, ...doc.data() });
      });
      
      return { homes };
    } catch (error) {
      return { error };
    }
  };
  
  export const getHomeById = async (homeId) => {
    try {
      const homeDoc = await getDoc(doc(db, 'homes', homeId));
      if (homeDoc.exists()) {
        return { home: { id: homeDoc.id, ...homeDoc.data() } };
      }
      return { error: 'Home not found' };
    } catch (error) {
      return { error };
    }
  };
  
  export const updateHome = async (homeId, homeData) => {
    try {
      await updateDoc(doc(db, 'homes', homeId), homeData);
      return { success: true };
    } catch (error) {
      return { error };
    }
  };
  
  export const deleteHome = async (homeId) => {
    try {
      await deleteDoc(doc(db, 'homes', homeId));
      return { success: true };
    } catch (error) {
      return { error };
    }
  };
  
  // Room operations
  export const createRoom = async (homeId, roomData) => {
    try {
      const roomRef = collection(db, 'rooms');
      const newRoomData = {
        ...roomData,
        homeId,
        createdAt: new Date(),
        totalItems: 0
      };
      
      const docRef = await addDoc(roomRef, newRoomData);
      
      // Update home's total rooms count
      const homeDoc = await getDoc(doc(db, 'homes', homeId));
      if (homeDoc.exists()) {
        const homeData = homeDoc.data();
        await updateDoc(doc(db, 'homes', homeId), {
          totalRooms: (homeData.totalRooms || 0) + 1
        });
      }
      
      return { roomId: docRef.id };
    } catch (error) {
      return { error };
    }
  };
  
  export const getRoomsByHomeId = async (homeId) => {
    try {
      const roomsQuery = query(collection(db, 'rooms'), where('homeId', '==', homeId));
      const querySnapshot = await getDocs(roomsQuery);
      const rooms = [];
      
      querySnapshot.forEach((doc) => {
        rooms.push({ id: doc.id, ...doc.data() });
      });
      
      return { rooms };
    } catch (error) {
      return { error };
    }
  };
  
  export const updateRoom = async (roomId, roomData) => {
    try {
      await updateDoc(doc(db, 'rooms', roomId), roomData);
      return { success: true };
    } catch (error) {
      return { error };
    }
  };
  
  export const deleteRoom = async (roomId, homeId) => {
    try {
      // Get room data to check if it exists
      const roomDoc = await getDoc(doc(db, 'rooms', roomId));
      if (!roomDoc.exists()) {
        return { error: 'Room not found' };
      }
      
      await deleteDoc(doc(db, 'rooms', roomId));
      
      // Update home's total rooms count
      if (homeId) {
        const homeDoc = await getDoc(doc(db, 'homes', homeId));
        if (homeDoc.exists()) {
          const homeData = homeDoc.data();
          await updateDoc(doc(db, 'homes', homeId), {
            totalRooms: Math.max((homeData.totalRooms || 0) - 1, 0)
          });
        }
      }
      
      return { success: true };
    } catch (error) {
      return { error };
    }
  };
  
  // Item operations
  export const createItem = async (roomId, homeId, itemData) => {
    try {
      const itemRef = collection(db, 'items');
      const newItemData = {
        ...itemData,
        roomId,
        homeId,
        createdAt: new Date()
      };
      
      const docRef = await addDoc(itemRef, newItemData);
      
      // Update room's total items count
      const roomDoc = await getDoc(doc(db, 'rooms', roomId));
      if (roomDoc.exists()) {
        const roomData = roomDoc.data();
        await updateDoc(doc(db, 'rooms', roomId), {
          totalItems: (roomData.totalItems || 0) + 1
        });
      }
      
      // Update home's total items count
      const homeDoc = await getDoc(doc(db, 'homes', homeId));
      if (homeDoc.exists()) {
        const homeData = homeDoc.data();
        await updateDoc(doc(db, 'homes', homeId), {
          totalItems: (homeData.totalItems || 0) + 1
        });
      }
      
      return { itemId: docRef.id };
    } catch (error) {
      return { error };
    }
  };
  
  export const getItemsByRoomId = async (roomId) => {
    try {
      const itemsQuery = query(collection(db, 'items'), where('roomId', '==', roomId));
      const querySnapshot = await getDocs(itemsQuery);
      const items = [];
      
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      
      return { items };
    } catch (error) {
      return { error };
    }
  };
  
  export const updateItem = async (itemId, itemData) => {
    try {
      await updateDoc(doc(db, 'items', itemId), itemData);
      return { success: true };
    } catch (error) {
      return { error };
    }
  };
  
  export const deleteItem = async (itemId, roomId, homeId) => {
    try {
      // Get item data to check if it exists
      const itemDoc = await getDoc(doc(db, 'items', itemId));
      if (!itemDoc.exists()) {
        return { error: 'Item not found' };
      }
      
      await deleteDoc(doc(db, 'items', itemId));
      
      // Update room's total items count
      if (roomId) {
        const roomDoc = await getDoc(doc(db, 'rooms', roomId));
        if (roomDoc.exists()) {
          const roomData = roomDoc.data();
          await updateDoc(doc(db, 'rooms', roomId), {
            totalItems: Math.max((roomData.totalItems || 0) - 1, 0)
          });
        }
      }
      
      // Update home's total items count
      if (homeId) {
        const homeDoc = await getDoc(doc(db, 'homes', homeId));
        if (homeDoc.exists()) {
          const homeData = homeDoc.data();
          await updateDoc(doc(db, 'homes', homeId), {
            totalItems: Math.max((homeData.totalItems || 0) - 1, 0)
          });
        }
      }
      
      return { success: true };
    } catch (error) {
      return { error };
    }
  };