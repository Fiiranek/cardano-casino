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
          <div className={styles.navbarTopSide}>
            <Link to="/fairness">Fairness</Link>
            <Link to="/bonuses">Bonuses</Link>
            <Link to="/about">About</Link>
          </div>
          <div className={styles.navbarTopSide}>
            {currentUser ? (
              <Link onClick={logoutUser}>Logout</Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        <div className={styles.navbarBottom}>
          <div className={styles.navbarBottomSide}>
            <Link to="/jackpot">Jackpot</Link>
            <Link to="/roulette">Roulette</Link>
            <Link to="/coinflip">Coinflip</Link>
            <Link to="/wagers">Wagers</Link>
          </div>
          <div className={styles.navbarBottomSide}>
            <Link to="/withdraw">Withdraw</Link>
            <Link to="/deposit">
              <div className="btn btnGreen">Deposit</div>
            </Link>
            {currentUser ? (
              <div className="btn btnYellow">{currentUser.balance} ADA</div>
            ) : undefined}
            {currentUser ? (
              <Link to="/account">
                <div className="btn btnYellow">{currentUser.username}</div>
              </Link>
            ) : (
              <Link to="/register">
                <div className="btn btnYellow">Register</div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
