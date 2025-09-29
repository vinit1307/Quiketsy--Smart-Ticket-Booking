import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Home from "../components/Home"; // Import the new Home component
import TrendingEventsPage from "../components/TrendingEventsPage";
import EventDetailsPage from "../components/EventDetailsPage";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <>
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/events" element={<TrendingEventsPage />} />
          <Route path="/event/:id" element={<EventDetailsPage />} /> {/* new route */}
        </Routes>
      </Router>
    </AuthProvider>
    <ToastContainer />
    </>
  );
}



export default App;
