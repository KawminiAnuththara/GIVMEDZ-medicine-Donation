import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig={
    apiKey: "AIzaSyAyWMoeBv68-zvmOGZl9JNJRP8leaU2om4",
    authDomain: "medicinedonation-d6d57.firebaseapp.com",
    projectId: "medicinedonation-d6d57",
    storageBucket: "medicinedonation-d6d57.appspot.com",
    messagingSenderId: "283878133602",
    appId: "1:283878133602:web:c967bbba0e89b41eaf663b",
    measurementId: "G-18GPRFPZXZ" 
}

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export {firebase};