import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./Auth.module.css";
import { useAuth } from "../../contexts/AuthContext";

function Register() {
  const history = useHistory();
  const { registerUser } = useAuth();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    username: "",
    walletAddress: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const registerResult = await registerUser(credentials);

    // there is an error
    if (registerResult.code) {
      const code = registerResult.code;
      if (code === "auth/email-already-in-use") {
        setErrorMsg("Email already registered");
      } else if (code === "auth/weak-password") {
        setErrorMsg("Weak password");
      }
    } else {
      setSuccessMsg("Registered!");
      setTimeout(() => {
        history.push("/spin");
      }, 5000);
    }

    // .then((res) => {
    //   console.log(res.user.email);
    //   setSuccessMsg(
    //     "Registered! Check your mail box to finish registration process!"
    //   );
    // })
    // .catch((err) => {
    //   console.log(err);
    //   setErrorMsg(err.message);
    // });
  };

  const changeCredentials = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.auth}>
      <span className={styles.authSpan}>Register</span>
      <span className={styles.errorMsg + " " + styles.msg}>
        {errorMsg.length > 0 ? errorMsg : ""}
      </span>
      <span className={styles.successMsg + " " + styles.msg}>
        {successMsg.length > 0 ? successMsg : ""}
      </span>
      <form className={styles.authForm} onSubmit={(e) => submitForm(e)}>
        <input
          onChange={(e) => changeCredentials(e)}
          name="walletAddress"
          type="username"
          placeholder="Wallet address"
          className={styles.authInput}
          required={true}
          // minLength="103"
          maxLength="103"
        ></input>
        <input
          onChange={(e) => changeCredentials(e)}
          name="username"
          type="text"
          placeholder="Username"
          className={styles.authInput}
          required={true}
        ></input>
        <input
          onChange={(e) => changeCredentials(e)}
          name="email"
          type="email"
          placeholder="Email"
          className={styles.authInput}
          required={true}
        ></input>
        <input
          onChange={(e) => changeCredentials(e)}
          name="password"
          placeholder="Password"
          type="password"
          className={styles.authInput}
          required={true}
        ></input>
        <input
          onChange={(e) => changeCredentials(e)}
          name="password2"
          placeholder="Repeat password"
          type="password"
          className={styles.authInput}
          required={true}
        ></input>
        <div className={styles.authHelpLinks}>
          <a href="/" className={styles.helpLink}>
            Lost password?
          </a>
          <a href="/login" className={styles.helpLink}>
            Login
          </a>
        </div>
        <button type="submit" className={"btn btnGreen " + styles.authBtn}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
