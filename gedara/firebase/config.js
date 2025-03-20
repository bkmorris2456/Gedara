import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "",
  authDomain: "gedara-12345.firebaseapp.com",
  projectId: "gedara-efb76",
  storageBucket: "gedara-efb76.firebasestorage.app",
  messagingSenderId: "17964960877",
  appId: "1:17964960877:ios:2f9c3048bae86e92624364",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };