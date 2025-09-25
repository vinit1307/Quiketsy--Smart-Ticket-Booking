import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Home from "../components/Home"; // Import the new Home component
import TrendingEventsPage from "../components/TrendingEventsPage";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/events" element={<TrendingEventsPage />} />
        </Routes>
      </Router>
    </>
  );
}



export default App;
