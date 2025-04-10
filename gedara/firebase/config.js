import {initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from 'expo-constants';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCdSrGg28SyBl0r9lbF-qdUHk5Bp_YBM0w",
    authDomain: "gedara-efb76.firebaseapp.com",
    databaseURL: "https://gedara-efb76-default-rtdb.firebaseio.com",
    projectId: "gedara-efb76",
    storageBucket: "gedara-efb76.firebasestorage.app",
    messagingSenderId: "17964960877",
    appId: "1:17964960877:web:009d9da891535552624364",
    measurementId: "G-VCLVPE2XB0"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);