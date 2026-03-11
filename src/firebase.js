import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC5a4LBue2XV-4haynToxruLjAPmJ6Jd-4",
 
  authDomain: "hibotalk.firebaseapp.com",
 
  projectId: "hibotalk",
 
  storageBucket: "hibotalk.firebasestorage.app",
 
  messagingSenderId: "1038006508037",
 
  appId: "1:1038006508037:web:9194eb1aa1299a8b681a6c",
 
  measurementId: "G-6GX61BRCQ5"
};

const app = initializeApp(firebaseConfig);
let messaging = null;

// Only initialize messaging if on HTTPS (required for Firebase Messaging)
if (window.location.protocol === 'https:') {
  messaging = getMessaging(app);
}

export { messaging };