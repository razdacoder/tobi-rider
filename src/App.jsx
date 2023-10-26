import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import History from "./screens/History";
import Home from "./screens/Home";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import RequireAuth from "./screens/RequireAuth";
import Splash from "./screens/Splash";
import WelcomeScreen from "./screens/WelcomeScreen";
const App = () => {
  return (
    <div className="h-screen w-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route element={<RequireAuth />}>
            <Route path="/home" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Route>
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
