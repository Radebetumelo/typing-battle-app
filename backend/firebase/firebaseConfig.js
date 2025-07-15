// backend/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXtXTv30_E-zdHK_qI-OkfnHMAS1XSLlA",
  authDomain: "typing-battle-app.firebaseapp.com",
  projectId: "typing-battle-app",
  storageBucket: "typing-battle-app.firebasestorage.app",
  messagingSenderId: "45693551968",
  appId: "1:45693551968:web:037b3badf5d9305fb04a05",
  measurementId: "G-FWJ53RG2MS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);

export { auth, db };