import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./Auth.module.css";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
  const { loginUser } = useAuth();
  const history = useHistory();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const submitForm = (e) => {
    setErrorMsg("");
    e.preventDefault();
    loginUser(credentials)
      .then((res) => {
        setSuccessMsg("Logged in!");
        setTimeout(() => {
          history.push("/spin");
        }, 5000);
      })
      .catch((err) => {
        console.log(err);
        if (err.code === "auth/wrong-password") {
          setErrorMsg("Wrong password");
        } else if (err.code === "auth/user-not-found") {
          setErrorMsg("No user with this email");
        }
      });
  };

  const changeCredentials = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.auth}>
      <span className={styles.authSpan}>Login</span>
      <span className={styles.errorMsg + " " + styles.msg}>
        {errorMsg.length > 0 ? errorMsg : ""}
      </span>
      <span className={styles.successMsg + " " + styles.msg}>
        {successMsg.length > 0 ? successMsg : ""}
      </span>
      <form className={styles.authForm} onSubmit={(e) => submitForm(e)}>
        <input
          onChange={(e) => changeCredentials(e)}
          name="email"
          type="email"
          placeholder="Email"
          className={styles.authInput}
          required
        ></input>
        <input
          onChange={(e) => changeCredentials(e)}
          name="password"
          placeholder="Password"
          type="password"
          className={styles.authInput}
          required
        ></input>
        <div className={styles.authHelpLinks}>
          <a className={styles.helpLink} href="/">
            Lost password
          </a>
          <a className={styles.helpLink} href="/register">
            Sign Up
          </a>
        </div>
        <button type="submit" className={"btn btnGreen " + styles.authBtn}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
