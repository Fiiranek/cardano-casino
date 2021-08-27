import React, { createContext, useContext, useState, useEffect } from "react";
import firebase from "../firebaseConfig";
import Database from "../modules/Database";
import { API_URL } from "../constants";
import Utils from "../modules/Utils";
import { send } from "process";
import { useAlert } from "react-alert";
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined);
  // const alertLib = useAlert();
  //const registerUser = async (credentials) => {
  const registerUser = async () => {
    // try {
    //   const result = await firebase
    //     .auth()
    //     .createUserWithEmailAndPassword(
    //       credentials.email,
    //       credentials.password
    //     );
    //   if (result) {
    //     // delete password from credentials
    //     delete credentials.password;

    //     // add userId to credentials
    //     credentials.userId = result.user.uid;
    //     Database.registerUser(credentials);
    //   }
    //   return result;
    // } catch (err) {
    //   return err;
    // }
    if (window.cardano) {
      const isCardanoEnabled = await window.cardano.enable();
      if (isCardanoEnabled) {
        let receiveAddress = await Utils.getReceiveAddress();
        let sendAddress = await Utils.getReceiveAddress();
        let credentials = {
          receiveAddress: receiveAddress,
          sendAddress: sendAddress,
        };

        const registerInDbResult = await Database.registerUser(credentials);

        if (registerInDbResult.status === 200) {
          const userData = await registerInDbResult.clone().json();
          setCurrentUser(userData);
          // alertLib.show("Registered!");
          alert("Registered!");
          return true;
        } else {
          return false;
        }
      }
    } else {
      alert("No ADA wallet detected!");
    }
  };

  // const loginUser = (credentials) => {
  //   return firebase
  //     .auth()
  //     .signInWithEmailAndPassword(credentials.email, credentials.password);
  // };

  const loginUser = async () => {
    if (window.cardano) {
      let isCardanoEnabled = await window.cardano.isEnabled();
      if (isCardanoEnabled) {
        let receiveAddress = await Utils.getReceiveAddress();
        let userData = await Database.getUserData(receiveAddress);

        if (userData) {
          setCurrentUser(userData);
          return userData;
        } else {
          return false;
        }
      }
    }
  };

  const logoutUser = () => {
    //return firebase.auth().signOut();
    setCurrentUser(undefined);
  };

  useEffect(() => {
    // firebase auth
    // const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    //   console.log("change");
    //   if (user) {
    //     //setCurrentUser(user);
    //     fetch(API_URL + "/users?userId=" + user.uid)
    //       .then((res) => res.json())
    //       .then((userData) => {
    //         setCurrentUser({
    //           ...user,
    //           ...userData,
    //         });
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         setCurrentUser(undefined);
    //       });
    //   } else {
    //     setCurrentUser(undefined);
    //   }
    // });
    //return unsubscribe;

    (async () => {
      if (window.cardano) {
        await loginUser();
      } else {
        let tryLoginInterval = setInterval(async () => {
          console.log("trying to login...");
          let userData = await loginUser();
          console.log(userData);
          if (userData || !userData) {
            clearInterval(tryLoginInterval);
          }
        }, 2000);
      }
    })();
  }, []);

  const value = {
    currentUser,
    registerUser,
    loginUser,
    logoutUser,
    setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
