import firebase from "firebase/app";
import "firebase/auth";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: "tilecloud-beta-dashboard.firebaseapp.com",
  databaseURL: "https://tilecloud-beta-dashboard.firebaseio.com",
  projectId: "tilecloud-beta-dashboard",
  storageBucket: "tilecloud-beta-dashboard.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
};

firebase.initializeApp(config);
export default firebase;
