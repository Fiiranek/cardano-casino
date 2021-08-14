import React from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
function Navbar() {
  let { currentUser, logoutUser } = useAuth();
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <img
          className={styles.navbarLogo}
          src="https://csgoempire.com/img/coin-bonus.806c9d88.png"
          alt=""
        />
      </div>

      <div className={styles.navbarRight}>
        <div className={styles.navbarTop}>
          <Link to="/fairness">Fairness</Link>
          <Link to="/bonuses">Bonuses</Link>
          <Link to="/about">About</Link>
        </div>
        <div className={styles.navbarBottom}>
          <div className={styles.navbarBottomSide}>
            <Link to="/spin">Spin</Link>
            <Link to="/coinflip">Coinflip</Link>
            <Link to="/wagers">Wagers</Link>
          </div>
          <div className={styles.navbarBottomSide}>
            <Link to="/withdraw">Withdraw</Link>
            <Link to="/deposit">
              <div className="btn btnGreen">Deposit</div>
            </Link>
            {currentUser ? (
              <Link to="/account">
                <div className="btn btnYellow">
                  Account {currentUser.username}
                </div>
              </Link>
            ) : (
              <Link to="/login">
                <div className="btn btnYellow">Login</div>
              </Link>
            )}
            {currentUser ? (
              <button className="btn btnYellow" onClick={logoutUser}>
                Logout
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
