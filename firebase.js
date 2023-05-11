import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage();
const db = firebase.firestore();

// Define fieldValue object as a function with isEqual method
const fieldValue = firebase.firestore.FieldValue;
fieldValue.isEqual = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export { db, storage, fieldValue };
