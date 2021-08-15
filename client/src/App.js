import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
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
import { useAuth } from "./contexts/AuthContext";
import Roulette from "./pages/Roulette/Roulette";
import { useDispatch } from "react-redux";
import { updateJackpotPlayers, updateJackpotTotaBet } from "./store/actions";
function App({ socket }) {
  let dispatch = useDispatch();
  const { currentUser } = useAuth();

  useEffect(() => {
    socket.on("place_bet", (jackpotData) => {
      console.log(jackpotData);
      dispatch(updateJackpotPlayers(jackpotData.players));
      dispatch(updateJackpotTotaBet(jackpotData.totalBet));
    });
  }, []);

  return (
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
