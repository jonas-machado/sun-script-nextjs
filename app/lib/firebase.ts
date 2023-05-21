// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAckdZpWE3cLLPS4dHGcG8A1Xj8Q1XnRBU",
  authDomain: "sun-script.firebaseapp.com",
  projectId: "sun-script",
  storageBucket: "sun-script.appspot.com",
  messagingSenderId: "660514811494",
  appId: "1:660514811494:web:98f44dd7f8482e5754c7a7",
  measurementId: "G-2VXQF0Y842",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const initFirebase = () => {
  return app;
};
