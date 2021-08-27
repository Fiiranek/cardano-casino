import React, { useState, useEffect, useRef, Component } from "react";
import styles from "./Jackpot.module.css";
import JackpotTile from "./JackpotTile";
import Utils from "../../modules/Utils";
import { useAuth } from "../../contexts/AuthContext";
import { useSelector } from "react-redux";
import { useAlert } from "react-alert";
import Confetti from "react-confetti";
import Database from "../../modules/Database";

export function Jackpot({ socket }) {
  let { currentUser, setCurrentUser } = useAuth();
  const players = useSelector((state) => state.jackpotPlayers);
  const totalBet = useSelector((state) => state.jackpotTotalBet);
  const confettiRef = useRef();
  const countdownSeconds = useSelector(
    (state) => state.jackpotCountdownSeconds
  );
  const jackpotState = useSelector((state) => state.jackpotState);

  const [betValue, setBetValue] = useState(0);

  const alertLib = useAlert();

  const increaseBetBtnHandler = (e) => {
    setBetValue(betValue + parseFloat(e.target.value));
  };

  const increaseBetInputHandler = (e) => {
    setBetValue(parseFloat(e.target.value));
  };

  const multiplyBetHandler = (e) => {
    setBetValue(betValue * 2);
  };
  const clearBetHandler = (e) => {
    setBetValue(0);
  };

  const placeBetEmitter = (socket) => {
    if (betValue <= 0) {
      alertLib.show("Bet value must be bigger than 0");
      return;
    }
    if (currentUser) {
      const canPlaceBet = betValue <= currentUser.balance;

      if (canPlaceBet) {
        let newPlayer = {
          ...currentUser,
          bet: betValue,
        };
        socket.emit("place_bet", newPlayer);

        const newBalance = currentUser.balance - betValue;

        setCurrentUser({ ...currentUser, balance: newBalance });
        alertLib.show(`${betValue} ADA bet placed`);
        console.log("BET PLACED");
      } else {
        alertLib.show(`Not enough funds`);
      }
    }
  };

  // useEffect(() => {
  //   (async function () {
  //     console.log("STATE:", jackpotState);
  //     if (jackpotState === 3) {
  //       console.log("UPDATED BALANCE");
  //       let userReceiveAddress = currentUser.receive_address;
  //       if (userReceiveAddress) {
  //         let updatedUserData = await Database.getUserData(userReceiveAddress);
  //         if (updatedUserData) {
  //           console.log("----------------");
  //           console.log(currentUser.balance);
  //           console.log(updatedUserData.balance);
  //           setCurrentUser({ ...currentUser, updatedUserData });
  //         }
  //       }
  //     }
  //   })();
  // }, [jackpotState]);

  return (
    <div className={styles.jackpotContainer}>
      <Confetti
        ref={confettiRef}
        style={{
          display:
            Utils.isUserWinner(currentUser, players) && jackpotState === 3
              ? "block"
              : "none",
        }}
      />
      <div className={styles.jackpotTop}>
        <button
          className={styles.placeBetBtn}
          disabled={
            currentUser ? jackpotState === 2 || jackpotState === 3 : true
          }
          onClick={() => placeBetEmitter(socket)}
        >
          PLACE BET
        </button>
        <input
          className={styles.betInput}
          type="number"
          min={0}
          max={1000000}
          value={betValue}
          onChange={(e) => increaseBetInputHandler(e)}
          onInput={(e) => increaseBetInputHandler(e)}
        />
        <button className={styles.modifyBetBtn} onClick={clearBetHandler}>
          Clear
        </button>

        <button
          className={styles.modifyBetBtn}
          value={10}
          onClick={(e) => increaseBetBtnHandler(e)}
        >
          +10
        </button>

        <button className={styles.modifyBetBtn} onClick={multiplyBetHandler}>
          X2
        </button>
        <button className={styles.modifyBetBtn}>MAX</button>
      </div>

      {jackpotState === 0 ? (
        <span className={styles.jackpotCountdownSpan}>
          Waiting for players...
        </span>
      ) : undefined}
      {jackpotState === 1 ? (
        <span className={styles.jackpotCountdownSpan}>
          Starts in {countdownSeconds}s ...
        </span>
      ) : undefined}

      {jackpotState === 2 ? (
        <span className={styles.jackpotCountdownSpan}>Drawing!</span>
      ) : undefined}

      {jackpotState === 3 ? (
        <span className={styles.jackpotCountdownSpan}>
          {Utils.getWinner(players)
            ? Utils.shortenAddress(Utils.getWinner(players).receive_address) +
              " is winner!"
            : ""}
        </span>
      ) : undefined}

      <span className={styles.jackpotCountdownSpan}>Total: {totalBet}</span>
      <div className={styles.jackpotBottom}>
        <div className={styles.jackpotBottomLeft}>
          <div className={styles.jackpot}>
            {players.length > 0 ? (
              players.map((player, index) => (
                <JackpotTile key={index} player={player} totalBet={totalBet} />
              ))
            ) : (
              <span>No players yet!</span>
            )}
          </div>
        </div>
        <div className={styles.jackpotBottomRight}></div>
      </div>
    </div>
  );
}
