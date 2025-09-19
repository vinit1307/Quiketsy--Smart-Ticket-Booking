import React from "react";
import { Menu } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md">
      {/* Left side - Logo */}
      <div className="text-2xl font-bold text-blue-700">
        Quiketsy
      </div>

      {/* Right side - Search + Links + Buttons */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search events, concerts..."
          className="w-65 px-4 py-1.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Events Button */}
        <button className=" ml-4 text-blue-700 hover:text-blue-800 font-medium">
          Events
        </button>

        {/* Sign In Button */}
        <button className="px-4 py-1.5 bg-blue-700 text-white rounded-2xl hover:bg-blue-800 transition">
          Sign In
        </button>

        {/* Hamburger Button */}
        <button className="p-2 rounded-md hover:bg-gray-200">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
