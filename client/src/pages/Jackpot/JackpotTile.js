import React from "react";
import styles from "./Jackpot.module.css";
function SpinTile({ player, totalBet }) {
  const percent = player.size * 100;

  return (
    <div
      className={styles.jackpotTile}
      style={{
        height: `${player.size * 500}px`,
        background: player.color,
      }}
    >
      <span className={styles.playerNick}>
        {player.username} - {percent.toFixed(2)}% WIN
      </span>
    </div>
  );
}

export default SpinTile;
