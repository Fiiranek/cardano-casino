import React, { createContext, useContext, useState, useEffect } from "react";
import firebase from "../firebaseConfig";
import Database from "../modules/Database";
import { API_URL } from "../constants";
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined);

  const registerUser = async (credentials) => {
    try {
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(
          credentials.email,
          credentials.password
        );
      if (result) {
        // delete password from credentials
        delete credentials.password;

        // add userId to credentials
        credentials.userId = result.user.uid;
        Database.registerUser(credentials);
      }
      return result;
    } catch (err) {
      return err;
    }

    // console.log(result);
  };

  const loginUser = (credentials) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password);
  };

  const logoutUser = () => {
    return firebase.auth().signOut();
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      console.log("change");
      if (user) {
        //setCurrentUser(user);
        fetch(API_URL + "/users?userId=" + user.uid)
          .then((res) => res.json())
          .then((userData) => {
            setCurrentUser({
              ...user,
              ...userData,
            });
          })
          .catch((err) => {
            console.log(err);
            setCurrentUser(undefined);
          });
        // Database.getUserData(user.uid)
        //   .then((res) => res.json())
        //   .then((data) => {
        //     console.log(data);
        //   })
        // .catch((err) => {
        //   console.log(err);
        //   //setCurrentUser(undefined);
        // });
      } else {
        setCurrentUser(undefined);
      }
    });

    return unsubscribe;
  }, []);

  const value = { currentUser, registerUser, loginUser, logoutUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
