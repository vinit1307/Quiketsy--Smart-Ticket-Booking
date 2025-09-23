import React from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-11 py-3 bg-white shadow-md">
      {/* Left side - Logo + Text */}
      <div className="flex items-center space-x-3">
        {/* Show logo only on md+ screens */}
        <img src="../Images/QuiketsyLogo.png" alt="Quiketsy Logo" height={100} width={100} className="hidden md:block"></img>
        <div className="text-2xl font-bold text-blue-700">Quiketsy</div>
      </div>

      {/* Right side - Search + Links + Buttons */}
      <div className="flex items-center space-x-4">
        {/* Search Bar - only on md+ */}
        <input
          type="text"
          placeholder="Search events, concerts..."
          className="hidden md:block w-64 px-4 py-1.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Events Button - only on md+ */}
        <button className="hidden md:block ml-4 text-blue-700 hover:text-blue-800 font-medium">
          Events
        </button>

        {/* Sign In Button - always visible */}
        {/* <Link to="/signin">

        <button className="px-4 py-1.5 bg-blue-700 text-white rounded-2xl hover:bg-blue-800 transition">
          Sign In
        </button>
        </Link> */}

        {/* Sign In Button with Link */}
        <Link
          to="/signin"
          className="px-4 py-1.5 bg-blue-700 text-white rounded-2xl hover:bg-blue-800 transition"
        >
          Sign In
        </Link>

        {/* Hamburger Button - always visible */}
        <button className="p-2 rounded-md hover:bg-gray-200">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
