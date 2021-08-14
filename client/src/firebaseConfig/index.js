import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCfb_SFuJlVuRUCXscqDC7O9IxRBJ_CJsk",
  authDomain: "euro-2020-typer.firebaseapp.com",
  projectId: "euro-2020-typer",
  storageBucket: "euro-2020-typer.appspot.com",
  messagingSenderId: "177327653924",
  appId: "1:177327653924:web:d11f818d0cd399d06d04b1",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
