import React from "react";
import styles from "./Jackpot.module.css";
import Utils from "../../modules/Utils";
function SpinTile({ player, totalBet }) {
  const percent = player.size * 100;

  return (
    <div
      className={styles.jackpotTile}
      style={{
        height: `${player.size * 500}px`,
        background: player.color,
        border: player.winner ? "2px solid green" : "none",
      }}
    >
      <span className={styles.playerNick}>
        {Utils.shortenAddress(player.address)} - {player.bet} ADA -
        {percent.toFixed(2)}% WIN
      </span>
    </div>
  );
}

export default SpinTile;
