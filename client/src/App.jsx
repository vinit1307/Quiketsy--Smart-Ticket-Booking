import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Carousel from "../components/Carousel";

function App() {
  return (
    <>
      {/* <p class="bg-amber-400">Hello</p> */}
      {/* <Navbar></Navbar> */}
      <Router>
        <Navbar />
        <div className="mt-6 w-full">
          <Carousel
            autoplay={true}
            autoplayDelay={3000}
            pauseOnHover={true}
            loop={true}
            round={false}
          />
        </div>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* You can add more pages here */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
