import React from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Utils from "../../modules/Utils";
function Navbar() {
  let { currentUser, logoutUser, registerUser } = useAuth();

  const connectWallet = async () => {
    const registerResult = await registerUser();
    console.log(registerResult);
  };

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
          {/* <div className={styles.navbarTopSide}>
            {currentUser ? (
              <Link onClick={logoutUser}>Logout</Link>
            ) : (
              <div></div>
            )}
            </div>*/}
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
                <div className="btn btnYellow">
                  {Utils.shortenAddress(currentUser.receive_address)}
                </div>
              </Link>
            ) : (
              <div className="btn btnYellow" onClick={(e) => connectWallet()}>
                Connect wallet
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
