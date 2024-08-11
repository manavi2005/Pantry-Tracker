// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBv7m2B0RNQkLZxvbJhBFJwMvkrenbIF6Q",
  authDomain: "inventory-management-ddee6.firebaseapp.com",
  projectId: "inventory-management-ddee6",
  storageBucket: "inventory-management-ddee6.appspot.com",
  messagingSenderId: "953015460869",
  appId: "1:953015460869:web:beed9287bf35aa602da86c",
  measurementId: "G-2WXRSG87M4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore }