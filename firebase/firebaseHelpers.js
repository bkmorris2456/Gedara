import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  writeBatch,
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

/**
 * Deletes a document and any of its related sub-elements depending on type.
 * @param {'property' | 'room' | 'item'} type - The type of element to delete.
 * @param {string} id - The ID of the element.
 */
export const deleteElementAndChildren = async (type, id) => {
  const batch = writeBatch(db);

  if (type === 'property') {
    // Delete all rooms and items linked to this property
    const roomsQuery = query(collection(db, 'rooms'), where('homeId', '==', id));
    const roomsSnapshot = await getDocs(roomsQuery);

    for (const roomDoc of roomsSnapshot.docs) {
      const roomId = roomDoc.id;
      
      // Delete all items inside this room
      const itemsQuery = query(collection(db, 'items'), where('roomId', '==', roomId));
      const itemsSnapshot = await getDocs(itemsQuery);
      itemsSnapshot.forEach((itemDoc) => batch.delete(doc(db, 'items', itemDoc.id)));

      // Delete the room itself
      batch.delete(doc(db, 'rooms', roomId));
    }

    // Delete the property
    batch.delete(doc(db, 'properties', id));

  } else if (type === 'room') {
    // Delete all items linked to this room
    const itemsQuery = query(collection(db, 'items'), where('roomId', '==', id));
    const itemsSnapshot = await getDocs(itemsQuery);
    itemsSnapshot.forEach((itemDoc) => batch.delete(doc(db, 'items', itemDoc.id)));

    // Delete the room itself
    batch.delete(doc(db, 'rooms', id));

  } else if (type === 'item') {
    // Just delete the item
    batch.delete(doc(db, 'items', id));
  }

  await batch.commit();
};