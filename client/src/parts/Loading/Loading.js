import React from "react";
import ReactLoading from "react-loading";

import styles from "./Loading.module.css";
export default function Loading() {
  return (
    <div className={styles.loading}>
      <ReactLoading type={"spin"} height={200} width={200} />
      <h1 className={styles.loadingText}>Loading...</h1>
    </div>
  );
}
