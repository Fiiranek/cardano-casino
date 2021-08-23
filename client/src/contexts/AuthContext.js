import React, { createContext, useContext, useState, useEffect } from "react";
import firebase from "../firebaseConfig";
import Database from "../modules/Database";
import { API_URL } from "../constants";
import Utils from "../modules/Utils";
import { send } from "process";
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined);

  const registerUser = async (credentials) => {
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
        console.log(window.cardano);
        let receiveAddress = (await window.cardano.getUsedAddresses())[0];

        receiveAddress = Utils.convertBaseAddressToCardanoAddress(
          receiveAddress
        );

        let sendAddress = (await window.cardano.getUsedAddresses())[0];
        sendAddress = Utils.convertBaseAddressToCardanoAddress(sendAddress);

        credentials.receiveAddress = receiveAddress;
        credentials.sendAddress = sendAddress;

        const registerInDbResult = await Database.registerUser(credentials);

        if (registerInDbResult.status === 200) {
          // success
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
      let isCardanoWalletInstalled = await window.cardano.isEnabled();
      if (isCardanoWalletInstalled) {
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
          let userData = await loginUser();
          if (userData || userData === false) {
            clearInterval(tryLoginInterval);
          }
        }, 3000);
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
