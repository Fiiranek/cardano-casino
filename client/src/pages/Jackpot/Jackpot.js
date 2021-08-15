import React, { useState, useEffect, useRef, Component } from "react";
import styles from "./Jackpot.module.css";
import JackpotTile from "./JackpotTile";
import Utils from "../../modules/Utils";
import { useAuth } from "../../contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";

export function Jackpot({ socket }) {
  // let dispatch = useDispatch();
  let { currentUser } = useAuth();
  const players = useSelector((state) => state.jackpotPlayers);
  const totalBet = useSelector((state) => state.totalBet);
  const countdownState = useSelector((state) => state.jackpotCountdownState);
  const drawingState = useSelector((state) => state.jackpotDrawingState);
  const countdownSeconds = useSelector(
    (state) => state.jackpotCountdownSeconds
  );

  const [betValue, setBetValue] = useState(0);
  useEffect(() => {
    console.log(players, "upp");
  }, [players]);

  const spin = () => {
    let minSpinNumber = 1000;
    let maxSpinNumber = 3000;
    let spinNumber = 78; //mocked

    for (let i = 0; i < spinNumber; i++) {
      setTimeout(() => {
        alert(
          "Winner: " +
            Utils.getRandomWinnerWithChances(players).name +
            " " +
            (((i + 1) / spinNumber) * 100).toFixed() +
            "%"
        );
      }, i * 50);
    }
  };

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
    if (currentUser) {
      let newPlayer = {
        userId: currentUser.uid,
        username: currentUser.username,
        bet: parseInt(betValue),
      };
      console.log("EMIT");
      socket.emit("place_bet", newPlayer);
    }
  };

  useEffect(() => {
    console.log(drawingState);
    if (drawingState) {
      console.log("start drawing");
    }
  }, [drawingState]);

  return (
    <div className={styles.jackpotContainer}>
      <div className={styles.jackpotTop}>
        <button
          className={styles.placeBetBtn}
          disabled={currentUser ? false : true}
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

      {countdownState ? (
        <span className={styles.jackpotCountdownSpan}>
          Starts in {countdownSeconds}s ...
        </span>
      ) : drawingState ? (
        <span className={styles.jackpotCountdownSpan}>Drawing...</span>
      ) : (
        <span className={styles.jackpotCountdownSpan}>
          Waiting for players...
        </span>
      )}

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
