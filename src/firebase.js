import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
   apiKey: "AIzaSyCAVyuHzI5ENsFBF-RwCijn5vz1_9xYaW8",
  authDomain: "dayscore-c2446.firebaseapp.com",
  projectId: "dayscore-c2446",
  storageBucket: "dayscore-c2446.firebasestorage.app",
  messagingSenderId: "159398443049",
  appId: "1:159398443049:web:94c456dd1522d72b790438",
  measurementId: "G-0KZEZ058HW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
