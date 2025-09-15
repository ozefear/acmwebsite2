import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFq-H9aqClm3dcGCRGPYhTY-rdEUd28qM",
  authDomain: "acm-website-d1720.firebaseapp.com",
  projectId: "acm-website-d1720",
  storageBucket: "acm-website-d1720.appspot.com",
  messagingSenderId: "427796247508",
  appId: "1:427796247508:web:c484dc28d305a93f019c41",
  measurementId: "G-HEHV6BPTGE"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export {db}
