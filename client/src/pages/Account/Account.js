import React from "react";
import styles from "./Accout.module.css";

import { useAuth } from "../../contexts/AuthContext";

function Account() {
  let { currentUser, setCurrentUser } = useAuth();
  return (
    <div className={styles.accountContainer}>
      <div className={styles.accountInfo}>
        <span>Address: {currentUser.address}</span>

        <span>Jackpots played: </span>
      </div>
    </div>
  );
}

export default Account;
