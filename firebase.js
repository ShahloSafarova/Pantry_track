// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi9Oc83aFI_WXAiAyADW_gJHN9jOKh23w",
  authDomain: "inventory-management-b36dc.firebaseapp.com",
  projectId: "inventory-management-b36dc",
  storageBucket: "inventory-management-b36dc.appspot.com",
  messagingSenderId: "274282560537",
  appId: "1:274282560537:web:fefa0a50efe3073fb87e88",
  measurementId: "G-5QCLE1LTK8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

export { firestore, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };
