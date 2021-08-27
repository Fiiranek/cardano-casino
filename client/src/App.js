import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import "./styles/globals.css";
import { useEffect } from "react";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Navbar from "./parts/Navbar/Navbar";
import { Jackpot } from "./pages/Jackpot/Jackpot";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Account from "./pages/Account/Account";
import Loading from "./parts/Loading/Loading";
import { useAuth } from "./contexts/AuthContext";
import Roulette from "./pages/Roulette/Roulette";
import { useDispatch } from "react-redux";
import {
  updateJackpotPlayers,
  updateJackpotTotaBet,
  updateJackpotCountdownSeconds,
  updateJackpotState,
} from "./store/actions";
function App({ socket }) {
  let dispatch = useDispatch();
  const { currentUser } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
      setIsLoading(false);
    });

    socket.on("place_bet", (jackpotData) => {
      console.log(jackpotData);
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
      // if(data.state === 3 && ){
      //   alert('You won')
      // }

      dispatch(updateJackpotState(data.state));
    });

    // socket.on("update_jackpot_winner_data", async (winnerData) => {
    //   console.log(winnerData);
    // });
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
            <Route
              path="/account"
              component={(props) =>
                currentUser ? <Account /> : <Redirect to="/" />
              }
            />
            <Route path="/" component={(props) => <Home />} />
          </div>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
