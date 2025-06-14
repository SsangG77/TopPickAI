import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBoQ25pktbq1QhR5AyjIKY-07z5-MJ6mBw",
    authDomain: "toppick-ai.firebaseapp.com",
    projectId: "toppick-ai",
    storageBucket: "toppick-ai.firebasestorage.app",
    messagingSenderId: "108964547926",
    appId: "1:108964547926:web:cb889c6bd1d3192228daf7",
    measurementId: "G-JG7YKR070T"
  };

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);