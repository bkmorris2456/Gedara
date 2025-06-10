import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config';

/**
 * Adds a new property to the "properties" collection.
 */
export const addNewProperty = async (userId, propertyData) => {
  const newProperty = {
    ...propertyData,
    userId,
    createdAt: serverTimestamp(),
  };

  const propertiesRef = collection(db, 'properties');
  const docRef = await addDoc(propertiesRef, newProperty);
  return docRef.id;
};

/**
 * Fetches all properties owned by a specific user.
 */
export const getUserProperties = async (userId) => {
  const q = query(collection(db, 'properties'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Adds a new room to the "rooms" collection and updates the room count in its parent property.
 */
export const addRoomToProperty = async (userId, roomName, propertyId) => {
  const propertyRef = doc(db, 'properties', propertyId);
  const roomRef = doc(collection(db, 'rooms'));

  await runTransaction(db, async (transaction) => {
    const propDoc = await transaction.get(propertyRef);
    if (!propDoc.exists()) throw new Error('Property does not exist');

    const currentTotal = propDoc.data().roomTotal || 0;

    transaction.set(roomRef, {
      roomName: roomName.trim(),
      homeId: propertyId,
      userId,
      estVal: 0,
      createdAt: serverTimestamp(),
    });

    transaction.update(propertyRef, {
      roomTotal: currentTotal + 1,
    });
  });
};

/**
 * Fetches all rooms within a given property for a user.
 */
export const getRoomsForProperty = async (userId, propertyId) => {
  const q = query(
    collection(db, 'rooms'),
    where('userId', '==', userId),
    where('homeId', '==', propertyId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Adds an item to the "items" collection.
 */
export const addItemToRoom = async (userId, itemData) => {
  const newItem = {
    ...itemData,
    userId,
    createdAt: serverTimestamp(),
  };

  const itemsRef = collection(db, 'items');
  const docRef = await addDoc(itemsRef, newItem);
  return docRef.id;
};
