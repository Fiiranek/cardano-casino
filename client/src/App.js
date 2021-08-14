import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import "./styles/globals.css";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Navbar from "./parts/Navbar/Navbar";
import Spin from "./pages/Spin/Spin";
import Spin2 from "./pages/Spin/Spin2";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { useAuth } from "./contexts/AuthContext";
function App() {
  const { currentUser } = useAuth();
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Switch>
          <div className="appBody">
            <Route path="/about" component={(props) => <About />} />
            <Route path="/contact" component={(props) => <Contact />} />
            <Route path="/spin" component={(props) => <Spin />} />
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
