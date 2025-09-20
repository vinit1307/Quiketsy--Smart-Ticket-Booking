import React from "react";
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

function App() {

  return (
    <>
      {/* <p class="bg-amber-400">Hello</p> */}
      {/* <Navbar></Navbar> */}
      <Router>
      <Navbar />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {/* You can add more pages here */}
      </Routes>
    </Router>
    </>
  );
}

export default App
