import React, { useState, useEffect, useRef } from "react";
import styles from "./Jackpot.module.css";
import JackpotTile from "./JackpotTile";
import Utils from "../../modules/Utils";
import { useAuth } from "../../contexts/AuthContext";
import { useSelector } from "react-redux";
import { useAlert } from "react-alert";
import Confetti from "react-confetti";

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

  const placeBetEmitter = (socket, players, currentUser) => {
    if (!currentUser) {
      alertLib.show("You must register to join jackpot");
      return false;
    }
    if (jackpotState === 2 || jackpotState === 3) {
      alertLib.show("Can not join jackpot now");
      return false;
    }
    if (Utils.isUserAlreadyInJackpot(players, currentUser)) {
      alertLib.show("You are already in jackpot");
      return false;
    }
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

  useEffect(() => {
    if (Utils.isUserWinner(currentUser, players) && jackpotState === 3) {
      alertLib.success(
        `You won! ${Utils.calculateWinnerPrize(totalBet)} ADA is Yours!`
      );
      confettiRef.current.style.display = "block";
    } else {
      confettiRef.current.style.display = "none";
    }
  }, [jackpotState]);

  return (
    <div className={styles.jackpotContainer}>
      <Confetti ref={confettiRef} />
      <div className={styles.jackpotTop}>
        <button
          className={styles.placeBetBtn}
          disabled={
            currentUser ? jackpotState === 2 || jackpotState === 3 : true
          }
          onClick={() => placeBetEmitter(socket, players, currentUser)}
        >
          PLACE BET
        </button>
        <input
          className={styles.betInput}
          type="number"
          step="1"
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
            ? Utils.shortenAddress(Utils.getWinner(players).address) +
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
        <div className={styles.jackpotBottomRight}>
          {/*} <div
            className={styles.jackpot + " " + styles.jackpotPlayersList}
            style={{ display: players.length > 0 ? "flex" : "none" }}
            ></div>*/}
        </div>
      </div>
    </div>
  );
}
