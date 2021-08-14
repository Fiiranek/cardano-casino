import React from "react";
import styles from "./Spin.module.css";
function SpinTile({ player, totalAmount }) {
  console.log(player);
  const percent = player.size * 100;
  // console.log(player, percent);
  return (
    <div
      className={styles.spinTile}
      style={{
        height: `${player.size * 500}px`,
        background: player.color,
      }}
    >
      <span className={styles.playerNick}>
        {player.name} - {percent.toFixed(2)}% WIN
      </span>
    </div>
  );
}

export default SpinTile;
