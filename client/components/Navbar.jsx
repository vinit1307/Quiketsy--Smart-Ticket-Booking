import React, { useState } from "react";
import { Menu, ChevronDown, MapPin} from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [selectedCity, setSelectedCity] = useState("Select City");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const cities = [
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
  ];

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <nav className="flex items-center justify-between px-11 py-3 bg-white shadow-md">
      {/* Left side - Logo + Text */}
      <div className="flex items-center space-x-3">
        <img
          src="../Images/QuiketsyLogo.png"
          alt="Quiketsy Logo"
          height={100}
          width={100}
          className="hidden md:block"
        />
        <div className="text-2xl font-bold text-blue-700">Quiketsy</div>
      </div>

      {/* Right side - Search + City Selector + Links + Buttons */}
      <div className="flex items-center space-x-4">
        {/* Search Bar - only on md+ */}
        <input
          type="text"
          placeholder="Search events, concerts..."
          className="hidden md:block w-64 px-4 py-1.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* City Selector (text + arrow) */}
        <div className="relative flex items-center cursor-pointer">
          <MapPin size={18} className="text-blue-600 mr-1" />
          <span className="text-gray-800" onClick={() => setIsOpen(!isOpen)}>
            {selectedCity}
          </span>
          <ChevronDown
            size={18}
            className={`ml-1 text-gray-600 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            onClick={() => setIsOpen(!isOpen)}
          />

          {isOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              {/* Search bar */}
              <input
                type="text"
                placeholder="Search city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border-b outline-none"
              />

              {/* City List */}
              <ul className="max-h-60 overflow-y-auto">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        setSelectedCity(city);
                        setIsOpen(false);
                        setSearch("");
                      }}
                    >
                      {city}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">No results found</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Events Button - only on md+ */}
        <button className="hidden md:block text-blue-700 hover:text-blue-800 font-medium">
          Events
        </button>

        {/* Sign In Button */}
        <Link
          to="/signin"
          className="px-4 py-1.5 bg-blue-700 text-white rounded-2xl hover:bg-blue-800 transition"
        >
          Sign In
        </Link>

        {/* Hamburger Button */}
        <button className="p-2 rounded-md hover:bg-gray-200">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
