/** @format */

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDPw9QXeuUxxpFEtKtdX8DTl4xRzWGmhsY",
  authDomain: "instagram-clone-2974d.firebaseapp.com",
  projectId: "instagram-clone-2974d",
  storageBucket: "instagram-clone-2974d.appspot.com",
  messagingSenderId: "782266220988",
  appId: "1:782266220988:web:3da0f8cf1b2734617cebb9",
  measurementId: "G-4Y4T84P2QP",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};
