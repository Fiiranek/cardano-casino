import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBl7O7LbhD1tw04esb8H_0J1jcCdJRSe6g",
  authDomain: "cardano-casino.firebaseapp.com",
  projectId: "cardano-casino",
  storageBucket: "cardano-casino.appspot.com",
  messagingSenderId: "679965572345",
  appId: "1:679965572345:web:95f5df620d392eb9c53628",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
