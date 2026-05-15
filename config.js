// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCdSrGg28SyBl0r9lbF-qdUHk5Bp_YBM0w",
    authDomain: "gedara-efb76.firebaseapp.com",
    databaseURL: "https://gedara-efb76-default-rtdb.firebaseio.com",
    projectId: "gedara-efb76",
    storageBucket: "gedara-efb76.firebasestorage.app",
    messagingSenderId: "17964960877",
    appId: "1:17964960877:web:009d9da891535552624364",
    measurementId: "G-VCLVPE2XB0"
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };