import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import "./styles/globals.css";
import { useEffect } from "react";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Navbar from "./parts/Navbar/Navbar";
import { Jackpot, JackpotParent } from "./pages/Jackpot/Jackpot";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Loading from "./parts/Loading/Loading";
import { useAuth } from "./contexts/AuthContext";
import Roulette from "./pages/Roulette/Roulette";
import { useDispatch, useSelector } from "react-redux";
import {
  updateJackpotPlayers,
  updateJackpotTotaBet,
  updateJackpotCountdownState,
  updateJackpotCountdownSeconds,
  updateJackpotDrawingState,
  updateJackpotState,
} from "./store/actions";
import Utils from "./modules/Utils";
import Database from "./modules/Database";
function App({ socket }) {
  let dispatch = useDispatch();
  const { currentUser, setCurrentUser } = useAuth();
  const players = useSelector((state) => state.jackpotPlayers);
  const totalBet = useSelector((state) => state.jackpotTotalBet);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // socket.onconnect = () => {
    //   console.log("connected...");
    //   setIsLoading(false);
    //   // socket.emit("ehlo", currentUser);
    // };

    socket.on("place_bet", (jackpotData) => {
      dispatch(updateJackpotPlayers(jackpotData.players));
      dispatch(updateJackpotTotaBet(jackpotData.totalBet));
    });

    socket.on("increase_jackpot_countdown", (data) => {
      dispatch(updateJackpotCountdownSeconds(data.seconds));
    });

    socket.on("draw_jackpot", (data) => {
      dispatch(updateJackpotPlayers(data.players));
    });

    socket.on("change_jackpot_state", async (data) => {
      dispatch(updateJackpotState(data.state));
    });
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Switch>
          <div className="appBody">
            <Route path="/about" component={(props) => <About />} />
            <Route path="/contact" component={(props) => <Contact />} />
            <Route
              path="/jackpot"
              component={() => <Jackpot socket={socket} />}
            />
            <Route path="/roulette" component={(props) => <Roulette />} />
            <Route
              path="/login"
              component={(props) =>
                currentUser ? <Redirect to="/account" /> : <Login />
              }
            />
            <Route path="/register" component={(props) => <Register />} />
            <Route path="/" component={(props) => <Home />} />
          </div>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
