import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBoDkpLuu4pAfyBa-aYdF301Wt2HIB8WWE",
  authDomain: "skill-twins.firebaseapp.com",
  projectId: "skill-twins",
  storageBucket: "skill-twins.firebasestorage.app",
  messagingSenderId: "1098522378158",
  appId: "1:1098522378158:web:58d083fe410f196aaf923f",
  measurementId: "G-QH04M5MYX0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();