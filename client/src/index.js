import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
// import { createStore } from "redux";
// import { Provider } from "react-redux";
// import { allReducers } from "./store/reducers";
import { AuthProvider } from "./contexts/AuthContext";
// const store = createStore(allReducers);
ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
