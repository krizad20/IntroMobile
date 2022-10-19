import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignOut from "./components/Sign-out";
import Credit from "./pages/Credits";
import Home from "./pages/Home";
import SignIn from "./pages/Sign-in";
import SignUp from "./pages/Sign-up";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
  }, []); // empty 2nd arg - only runs once

  return (

    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-out" element={<SignOut />} />
      <Route path="/home" element={<Home />} />
      <Route path="/credit" element={<Credit />} />



    </Routes>
  );
}

export default App;
