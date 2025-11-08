import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Home from "../components/Home";
import AllEventsPage from "../components/AllEventsPage";
import EventDetailsPage from "../components/EventDetailsPage";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import History from "../components/History";
import Account from "../components/Account";
import CreateEvent from "../components/CreateEvent";
import EventHistory from "../components/EventHistory";
import ViewEvents from "../components/ViewEvents";
import EditEvent from "../components/EditEvent";
import ForgotPassword from "../components/ForgotPassword";
import BookEvent from "../components/BookEvent";
import Footer from "../components/Footer";
import PaymentSuccess from "../components/PaymentSuccess";
import VerifyTicket from "../components/VerifyTicket";
import ViewTicket from '../components/ViewTicket';


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
            <Route path="/events/:category" element={<AllEventsPage />} />
            <Route path="/event/:id" element={<EventDetailsPage />} />
            <Route path="/events/city/:city" element={<AllEventsPage />} />
            <Route path="/history" element={<History />} />
            <Route path="/account" element={<Account />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/event-history" element={<EventHistory />} />
            <Route path="/your-events" element={<ViewEvents />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/book-event/:id" element={<BookEvent />} />
            <Route path="/booking/success" element={<PaymentSuccess />} />
            <Route path="/verify-ticket/:id" element={<VerifyTicket />} />
            <Route path="/view-ticket" element={<ViewTicket />} />
          </Routes>
          <Footer/>
        </Router>
      </AuthProvider>
      <ToastContainer />
    </>
  );
}

export default App;

// import React from "react";
// import { useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import SignIn from "../components/SignIn";
// import SignUp from "../components/SignUp";
// import Home from "../components/Home"; // Import the new Home component
// import TrendingEventsPage from "../components/TrendingEventsPage";
// import EventDetailsPage from "../components/EventDetailsPage";
// import { AuthProvider } from "../contexts/AuthContext";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import History from "../components/History";
// import Account from "../components/Account";
// import AllEventsPage from "../components/AllEventsPage";


// function App() {
//   return (
//     <>
//     <AuthProvider>
//       <Router>
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/signin" element={<SignIn />} />
//           <Route path="/signup" element={<SignUp />} />
//           {/* <Route path="/events" element={<TrendingEventsPage />} /> */}
//           <Route path="/event/:id" element={<EventDetailsPage />} /> {/* new route */}
//           <Route path="/history" element={<History />} />
//           <Route path="/account" element={<Account />} />
//           <Route path="/all-events" element={<AllEventsPage />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//     <ToastContainer />
//     </>
//   );
// }



// export default App;
