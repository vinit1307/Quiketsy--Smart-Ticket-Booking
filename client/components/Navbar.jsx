import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  ChevronDown,
  MapPin,
  Search,
  X,
  CircleUser,
  History,
  Calendar,
  Plus,
  Eye,
  Clock,
  Palette,
} from "lucide-react";
import { TbCategory } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiLogoutCircleLine } from "react-icons/ri";
import { GiGuitar } from "react-icons/gi";
import { MdSportsGymnastics } from "react-icons/md";
import { LuDrama } from "react-icons/lu";
import { FaFaceLaughSquint } from "react-icons/fa6";
import { MdEventNote } from "react-icons/md";
import { FaLaptopCode } from "react-icons/fa";
import { GrWorkshop } from "react-icons/gr";
import { MdOutlineSportsMartialArts } from "react-icons/md";
import EventsService from "../services/eventsService";

const Navbar = () => {
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cities, setCities] = useState(["All Cities"]); // Initialize with "All Cities"
  const [loadingCities, setLoadingCities] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Simulating logged in user (replace with real auth later)
  //const [user, setUser] = useState(null); // null = guest | {name: "Vivek"}

  //Better approach use kar rahe he local state ki jagah auth pe jaake
  //alternative to above, agar dikkat aaye to vaapas vo use kar lenge
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth(); // Use auth context instead of local state

  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isManageEventsOpen, setIsManageEventsOpen] = useState(false);

  const categories = [
    { key: "music", name: "Music", icon: <GiGuitar className="h-4 w-4" /> },
    {
      key: "sports",
      name: "Sports",
      icon: <MdSportsGymnastics className="h-4 w-4" />,
    },
    { key: "plays", name: "Plays", icon: <LuDrama className="h-4 w-4" /> },
    {
      key: "standup",
      name: "Stand Up Comedy",
      icon: <FaFaceLaughSquint className="h-4 w-4" />,
    },
    {
      key: "art",
      name: "Arts & Culture",
      icon: <Palette className="h-4 w-4" />,
    },
    {
      key: "technology",
      name: "Technology",
      icon: <FaLaptopCode className="h-4 w-4" />,
    },
    {
      key: "workshop",
      name: "Workshops",
      icon: <GrWorkshop className="h-4 w-4" />,
    },
  ];

  // Add this useEffect after your state declarations
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const data = await EventsService.getCities();

        if (data && data.length > 0) {
          setCities(["All Cities", ...data]);
        } else {
          // Fallback cities
          setCities(["All Cities", "Mumbai", "Delhi", "Bangalore"]);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        // Fallback cities
        setCities(["All Cities", "Mumbai", "Delhi", "Bangalore"]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const savedCity = localStorage.getItem("selectedCity") || "All Cities";
    setSelectedCity(savedCity);
  }, []);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchInput = async (value) => {
    setSearchInput(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowSearchDropdown(true);

    // Debounce search - wait 300ms after user stops typing
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await EventsService.searchEvents(value.trim());
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSearchResultClick = (eventId) => {
    navigate(`/event/${eventId}`);
    setSearchInput("");
    setSearchResults([]);
    setShowSearchDropdown(false);
  };

  // Helper function to format date
  const formatSearchDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  // const cities = [
  //   "All Cities",
  //   "Mumbai",
  //   "Indore",
  //   "Delhi",
  //   "Bengaluru",
  //   "Hyderabad",
  //   "Chennai",
  //   "Kolkata",
  //   "Pune",
  //   "Ahmedabad",
  //   "Jaipur",
  //   "Lucknow",
  // ];

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md md:px-11">
        {/* Left side - Logo + Text */}
        <Link to="/">
          <div className="flex items-center">
            <img
              src="../Images/logohead.png"
              alt="Quiketsy Logo"
              className="h-10"
            />
            <div className="text-2xl ml-2 font-black text-[#008cff]">
              Quiketsy
            </div>
          </div>
        </Link>

        {/* Right side - Search + City Selector + Links + Buttons */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          {/* <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={20} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search events, concerts..."
              className="w-64 pl-10 pr-4 py-1.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div> */}

          {/* Search Bar with Dropdown */}
          <div className="relative hidden md:block" ref={searchRef}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={20} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search events, concerts..."
              value={searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() =>
                searchInput.trim().length >= 2 && setShowSearchDropdown(true)
              }
              className="w-64 pl-10 pr-4 py-1.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Search Results Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#008cff] mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    <div className="px-3 py-1 text-xs text-gray-500 font-semibold">
                      EVENTS ({searchResults.length} results)
                    </div>
                    {searchResults.map((event) => (
                      <div
                        key={event.eventId}
                        onClick={() => handleSearchResultClick(event.eventId)}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      >
                        <div className="flex items-start space-x-3">
                          {/* Event thumbnail */}
                          <img
                            src={event.imageUrl || "/Images/default-event.jpg"}
                            alt={event.name}
                            className="w-12 h-12 rounded object-cover flex-shrink-0"
                          />

                          {/* Event details */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {event.name}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin size={12} />
                                {event.city}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar size={12} />
                                {formatSearchDate(event.eventDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                {event.category}
                              </span>
                              {event.isTrending && (
                                <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                                  Trending
                                </span>
                              )}
                              <span className="text-xs text-gray-600 font-semibold">
                                ₹{event.ticketPrice}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* {searchResults.length > 5 && (
            <div className="px-3 py-2 text-center border-t">
              <button
                onClick={() => navigate(`/search?q=${encodeURIComponent(searchInput)}`)}
                className="text-sm text-[#008cff] hover:underline"
              >
                View all {searchResults.length} results
              </button>
            </div>
          )} */}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No events found for "{searchInput}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* City Selector */}
          <div className="relative flex items-center cursor-pointer ml-1">
            <MapPin size={18} className="text-[#008cff] mr-1" />
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
                {/* <ul className="max-h-60 overflow-y-auto">
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
                    <li className="px-4 py-2 text-gray-500">
                      No results found
                    </li>
                  )}
                </ul> */}

                {/* City List */}
                <ul className="max-h-60 overflow-y-auto">
                  {loadingCities ? (
                    <li className="px-4 py-2 text-gray-500">
                      Loading cities...
                    </li>
                  ) : filteredCities.length > 0 ? (
                    filteredCities.map((city, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => {
                          if (city === "All Cities") {
                            setSelectedCity(city);
                            navigate("/");
                          } else {
                            setSelectedCity(city);
                            navigate(`/events/city/${city}`);
                          }
                          setIsOpen(false);
                          setSearch("");
                        }}
                      >
                        {city}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">
                      No results found
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Sign In Button */}
          {/* <Link
            to="/signin"
            className="px-4 py-1.5 bg-[#008CFF] text-white rounded-2xl hover:bg-blue-800 transition"
          >
            Sign In
          </Link> */}
          {/*Alternative to upper which change sign in and logout when logged in and logged out*/}
          {/* Sign In Link / Logout Button - Conditional Rendering */}
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                toast.error("🚪 Logged out successfully!", {
                  position: "top-right",
                });
                navigate("/"); // redirect to home after logout
              }}
              className="hidden md:block px-4 py-1.5 font-bold border border-red-600 opacity-90 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/signin"
              className="hidden md:block px-4 py-1.5 font-bold border border-[#008CFF] opacity-90 text-[#008CFF] rounded-xl hover:bg-[#008CFF] hover:text-white transition"
            >
              Sign In
            </Link>
          )}

          {/* Hamburger Button */}
          <button
            className="p-0.5 rounded-md hover:bg-gray-200"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Overlay - smooth fade-in/out */}
      {/* Sidebar Content - smooth slide-in/out */}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-white shadow-lg z-50 flex flex-col rounded-s-[3vw] transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } ${isSidebarOpen ? "visible" : "invisible"}`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black z-10"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Header Section - Fixed */}
        <div className="p-6 pb-0">
          {/* User Greeting */}
          <div className="ml-1 mt-1">
            <h4 className="text-3xl font-semibold mb-1.5">Hey 👋</h4>
            {isAuthenticated && user ? (
              <h2 className="text-2xl font-semibold mt-2">{user.name}</h2>
            ) : (
              <div className="space-x-2">
                <h2 className="text-2xl font-semibold">Guest!</h2>
                <h1 className="text-sm font-semibold text-gray-400">
                  (Sign In or Sign Up)
                </h1>
              </div>
            )}
          </div>

          <hr className="mt-4 mb-3 border-black md:mb-5" />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6">
          {/* Mobile Search with Dropdown */}
          <div className="md:hidden mb-6 relative pt-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() =>
                  searchInput.trim().length >= 2 && setShowSearchDropdown(true)
                }
                className="w-full pl-9 pr-3.5 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Mobile Search Results */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                {isSearching ? (
                  <div className="p-3 text-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#008cff] mx-auto"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-1">
                    {searchResults.map((event) => (
                      <div
                        key={event.eventId}
                        onClick={() => {
                          handleSearchResultClick(event.eventId);
                          setIsSidebarOpen(false);
                        }}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <p className="text-sm font-semibold truncate">
                          {event.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {event.city} • {formatSearchDate(event.eventDate)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-gray-500">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Options */}
          <nav className="flex flex-col space-y-4 ml-1 text-bold text-base pb-4">
            <div>
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center justify-between w-full pr-2 hover:text-[#008CFF]"
              >
                <span className="flex items-center">
                  <TbCategory className="mr-2 h-5 w-5" /> Categories
                </span>
                <ChevronDown
                  size={18}
                  className={`ml-2 text-gray-600 transition-transform ${
                    isCategoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown items */}
              {isCategoriesOpen && (
                <ul className="ml-7 mt-2 space-y-2 text-gray-700">
                  {categories.map((category) => (
                    <li key={category.name}>
                      <Link
                        to={`/events/${category.key}`}
                        className="flex items-center space-x-2 hover:text-[#008CFF]"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        {category.icon}
                        <span>{category.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {isAuthenticated && (
              <>
                <Link
                  to="/account"
                  className="flex items-center space-x-2 hover:text-[#008CFF]"
                >
                  <CircleUser className="mr-2 h-5 w-5" /> Account
                </Link>

                {/* Manage Events Dropdown - Check both accountType and role */}
                {(user?.accountType === "ORGANIZER" ||
                  user?.role === "ORGANIZER") && (
                  <div>
                    <button
                      onClick={() => setIsManageEventsOpen(!isManageEventsOpen)}
                      className="flex items-center justify-between w-full pr-2 hover:text-[#008CFF]"
                    >
                      <span className="flex items-center">
                        <MdEventNote className="mr-2 h-5 w-5" /> Manage Events
                      </span>
                      <ChevronDown
                        size={18}
                        className={`ml-2 text-gray-600 transition-transform ${
                          isManageEventsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Manage Events Dropdown items */}
                    {isManageEventsOpen && (
                      <ul className="ml-7 mt-2 space-y-2 text-gray-700">
                        <li>
                          <Link
                            to="/create-event"
                            className="flex items-center space-x-2 hover:text-[#008CFF]"
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <Plus className="h-4 w-4" />
                            <span>Create an Event</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/your-events"
                            className="flex items-center space-x-2 hover:text-[#008CFF]"
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <Eye className="h-4 w-4" />
                            <span>View Your Events</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/event-history"
                            className="flex items-center space-x-2 hover:text-[#008CFF]"
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <Clock className="h-4 w-4" />
                            <span>Event History</span>
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                )}

                {user?.role === "USER" && (
                  <Link
                    to="/history"
                    className="flex items-center space-x-2 hover:text-[#008CFF]"
                  >
                    <History className="mr-2 h-5 w-5" />
                    Booking History
                  </Link>
                )}

                {user?.role === "ORGANIZER" && (
                  <Link
                    to="/history"
                    className="flex items-center space-x-2 hover:text-[#008CFF]"
                  >
                    <History className="mr-2 h-5 w-5 mt-0" />
                    Your Booking History
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Fixed Footer - Logout/Sign In Button */}
        <div className="border-t p-6 pt-4">
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                setIsSidebarOpen(false);
                toast.error("🚪 Logged out successfully!", {
                  position: "top-right",
                });
                navigate("/");
              }}
              className="flex items-center space-x-2 hover:text-red-600 text-left w-full ml-1.5 text-bold"
            >
              <RiLogoutCircleLine className="mr-2 h-5 w-5" /> Logout
            </button>
          ) : (
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                navigate("/signin");
              }}
              className="flex items-center space-x-2 hover:text-[#008cff] text-left w-full ml-1.5 text-bold"
            >
              <RiLogoutCircleLine className="mr-2 h-5 w-5" /> Sign in
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;

// import React, { useState, useEffect, useCallback  } from "react";
// import {
//   Menu,
//   ChevronDown,
//   MapPin,
//   Search,
//   X,
//   CircleUser,
//   History,
//   Calendar,
//   Plus,
//   Eye,
//   Clock,
//   Palette,
// } from "lucide-react";
// import { TbCategory } from "react-icons/tb";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { RiLogoutCircleLine } from "react-icons/ri";
// import { GiGuitar } from "react-icons/gi";
// import { MdSportsGymnastics } from "react-icons/md";
// import { LuDrama } from "react-icons/lu";
// import { FaFaceLaughSquint } from "react-icons/fa6";
// import { MdEventNote } from "react-icons/md";
// import { FaLaptopCode } from "react-icons/fa";
// import { GrWorkshop } from "react-icons/gr";
// import { MdOutlineSportsMartialArts } from "react-icons/md";
// import EventsService from "../services/eventsService";

// const Navbar = () => {
//   const [selectedCity, setSelectedCity] = useState("All Cities");
//   const [search, setSearch] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [cities, setCities] = useState(["All Cities"]); // Initialize with "All Cities"
//   const [loadingCities, setLoadingCities] = useState(true);

// // Replace the search-related states and functions:
// const [searchQuery, setSearchQuery] = useState("");
// const [searchResults, setSearchResults] = useState([]);
// const [showSearchResults, setShowSearchResults] = useState(false);
// const [searchLoading, setSearchLoading] = useState(false);
// const [searchTimeout, setSearchTimeout] = useState(null);

//   // Simulating logged in user (replace with real auth later)
//   //const [user, setUser] = useState(null); // null = guest | {name: "Vivek"}

//   //Better approach use kar rahe he local state ki jagah auth pe jaake
//   //alternative to above, agar dikkat aaye to vaapas vo use kar lenge
//   const navigate = useNavigate();
//   const { user, logout, isAuthenticated } = useAuth(); // Use auth context instead of local state

//   const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
//   const [isManageEventsOpen, setIsManageEventsOpen] = useState(false);

//   const categories = [
//     { key: 'music', name: "Music", icon: <GiGuitar className="h-4 w-4" /> },
//     { key: 'sports', name: "Sports", icon: <MdSportsGymnastics className="h-4 w-4" /> },
//     { key: 'plays',name: "Plays", icon: <LuDrama className="h-4 w-4" /> },
//     { key: 'standup', name: "Stand Up Comedy", icon: <FaFaceLaughSquint className="h-4 w-4" /> },
//     {key: 'art', name: 'Arts & Culture', icon: <Palette className="h-4 w-4" />},
//   { key: 'technology', name: 'Technology', icon: <FaLaptopCode className="h-4 w-4" />},
//   { key: 'workshop', name: 'Workshops', icon: <GrWorkshop className="h-4 w-4" />},
//   ];

//   // Add this useEffect after your state declarations
// useEffect(() => {
//   const fetchCities = async () => {
//     try {
//       setLoadingCities(true);
//       const data = await EventsService.getCities();

//       if (data && data.length > 0) {
//         setCities(["All Cities", ...data]);
//       } else {
//         // Fallback cities
//         setCities(["All Cities", "Mumbai", "Delhi", "Bangalore"]);
//       }
//     } catch (error) {
//       console.error("Error fetching cities:", error);
//       // Fallback cities
//       setCities(["All Cities", "Mumbai", "Delhi", "Bangalore"]);
//     } finally {
//       setLoadingCities(false);
//     }
//   };

//   fetchCities();
// }, []);

// useEffect(() => {
//   const savedCity = localStorage.getItem('selectedCity') || 'All Cities';
//   setSelectedCity(savedCity);
// }, []);

// // Add this function before the return statement
// // In handleSearch function, update the mapping:
// // const handleSearch = async (query) => {
// //   console.log("Search query:", query); // Debug
// //   setSearchQuery(query);

// //   if (query.trim().length > 1) {
// //     setSearchLoading(true);
// //     try {
// //       const results = await EventsService.searchEvents(query);
// //       console.log("Search API returned:", results); // Debug
// //       console.log("Results length:", results?.length); // Debug
// //       setSearchResults(results || []);
// //       setShowSearchResults(true);
// //     } catch (error) {
// //       console.error("Search error details:", error);
// //       setSearchResults([]);
// //       setShowSearchResults(true); // Show even if error
// //     } finally {
// //       setSearchLoading(false);
// //     }
// //   } else {
// //     setSearchResults([]);
// //     setShowSearchResults(false);
// //   }
// // };

// const performSearch = useCallback(async (query) => {
//   if (query.trim().length > 1) {
//     setSearchLoading(true);
//     try {
//       console.log("Performing search for:", query);
//       const results = await EventsService.searchEvents(query.trim());
//       console.log("Search results received:", results);
//       setSearchResults(results || []);
//       setShowSearchResults(true);
//     } catch (error) {
//       console.error("Search error:", error);
//       setSearchResults([]);
//       setShowSearchResults(true);
//     } finally {
//       setSearchLoading(false);
//     }
//   } else {
//     setSearchResults([]);
//     setShowSearchResults(false);
//   }
// }, []);

// // Add debounced search
// // Replace the debounced useEffect with direct call:
// const handleSearchInput = (e) => {
//   const query = e.target.value;
//   setSearchQuery(query);

//   // Clear existing timeout
//   if (searchTimeout) {
//     clearTimeout(searchTimeout);
//   }

//   const newTimeout = setTimeout(() => {
//     performSearch(query);
//   }, 300); // 300ms delay

//   setSearchTimeout(newTimeout);
// }

// useEffect(() => {
//   return () => {
//     if (searchTimeout) {
//       clearTimeout(searchTimeout);
//     }
//   };
// }, [searchTimeout]);

// // Add this useEffect
// useEffect(() => {
//   const handleClickOutside = (event) => {
//     if (!event.target.closest('.search-container')) {
//       setShowSearchResults(false);
//     }
//   };

//   document.addEventListener('mousedown', handleClickOutside);
//   return () => document.removeEventListener('mousedown', handleClickOutside);
// }, []);

//   // const cities = [
//   //   "All Cities",
//   //   "Mumbai",
//   //   "Indore",
//   //   "Delhi",
//   //   "Bengaluru",
//   //   "Hyderabad",
//   //   "Chennai",
//   //   "Kolkata",
//   //   "Pune",
//   //   "Ahmedabad",
//   //   "Jaipur",
//   //   "Lucknow",
//   // ];

//   const filteredCities = cities.filter((city) =>
//     city.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <>
//       <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md md:px-11">
//         {/* Left side - Logo + Text */}
//         <Link to="/">
//         <div className="flex items-center">
//           <img
//             src="../Images/logohead.png"
//             alt="Quiketsy Logo"
//             className="h-10"
//           />
//           <div className="text-2xl ml-2 font-black text-[#008cff]">Quiketsy</div>
//         </div>
//         </Link>

//         {/* Right side - Search + City Selector + Links + Buttons */}
//         <div className="flex items-center space-x-4">
//           {/* Search Bar */}
//           {/* <div className="relative hidden md:block">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <Search size={20} className="text-gray-500" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search events, concerts..."
//               className="w-64 pl-10 pr-4 py-1.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div> */}
//           {/* Search Bar */}
// <div className="relative hidden md:block search-container">
//   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//     <Search size={20} className="text-gray-500" />
//   </div>
//   <input
//   type="text"
//   value={searchQuery}
//   onChange={handleSearchInput}
//   onFocus={() => searchQuery && setShowSearchResults(true)}
//   placeholder="Search events, concerts..."
//   className="w-64 pl-10 pr-4 py-1.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
// />

//   {/* Search Results Dropdown */}
//   {/* Search Results Dropdown */}
// {showSearchResults && (
//   <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
//     {searchLoading ? (
//       <div className="p-4 text-center text-gray-500">Searching...</div>
//     ) : searchResults.length > 0 ? (
//       <div>

// {searchResults.slice(0, 8).map((event) => {
//   // Handle both eventId (UUID) and id (numeric) fields
//   const eventIdentifier = event.eventId || event.id;

//   return (
//     <div
//       key={eventIdentifier} // This fixes the key prop warning
//       onClick={() => {
//         console.log("Full event object:", event);
//         console.log("Event identifier:", eventIdentifier);

//         if (!eventIdentifier) {
//           console.error("No ID found in event:", event);
//           toast.error("Unable to open event details");
//           return;
//         }

//         // Navigate using the identifier (either UUID or numeric ID)
//         navigate(`/events/${eventIdentifier}`);
//         setShowSearchResults(false);
//         setSearchQuery("");
//       }}
//       className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
//     >
//       <div className="font-semibold text-sm">{event.name}</div>
//       <div className="text-xs text-gray-600 mt-1">
//         {/* Handle different field names */}
//         {event.venue} • {event.city || ''} • {event.eventDate || event.date || ''}
//       </div>
//       {event.category && (
//         <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mt-1 inline-block">
//           {event.category}
//         </span>
//       )}
//     </div>
//   );
// })}
//         {searchResults.length > 8 && (
//           <div
//             // In the search result click handler:
// onClick={() => {
//   const eventId = event.eventId || event.id;
//   console.log("Event object:", event); // Debug - see full event
//   console.log("Navigating to eventId:", eventId); // Debug
//   console.log("Navigation URL:", `/event/${eventId}`); // Debug

//   navigate(`/event/${eventId}`);
//   setShowSearchResults(false);
//   setSearchQuery("");
// }}
//             className="p-3 text-center text-blue-600 hover:bg-gray-100 cursor-pointer"
//           >
//             View all {searchResults.length} results →
//           </div>
//         )}
//       </div>
//     ) : searchQuery.trim().length > 1 ? (
//       <div className="p-4 text-center text-gray-500">
//         No events found for "{searchQuery}"
//       </div>
//     ) : null}
//   </div>
// )}
// </div>

//           {/* City Selector */}
//           <div className="relative flex items-center cursor-pointer ml-1">
//             <MapPin size={18} className="text-[#008cff] mr-1" />
//             <span className="text-gray-800" onClick={() => setIsOpen(!isOpen)}>
//               {selectedCity}
//             </span>
//             <ChevronDown
//               size={18}
//               className={`ml-1 text-gray-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
//                 }`}
//               onClick={() => setIsOpen(!isOpen)}
//             />

//             {isOpen && (
//               <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
//                 {/* Search bar */}
//                 <input
//                   type="text"
//                   placeholder="Search city..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="w-full px-3 py-2 border-b outline-none"
//                 />

//                 {/* City List */}
//                 {/* <ul className="max-h-60 overflow-y-auto">
//                   {filteredCities.length > 0 ? (
//                     filteredCities.map((city, index) => (
//                       <li
//                         key={index}
//                         className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
//                         onClick={() => {
//                           setSelectedCity(city);
//                           setIsOpen(false);
//                           setSearch("");
//                         }}
//                       >
//                         {city}
//                       </li>
//                     ))
//                   ) : (
//                     <li className="px-4 py-2 text-gray-500">
//                       No results found
//                     </li>
//                   )}
//                 </ul> */}

//                 {/* City List */}
// <ul className="max-h-60 overflow-y-auto">
//   {loadingCities ? (
//     <li className="px-4 py-2 text-gray-500">Loading cities...</li>
//   ) : filteredCities.length > 0 ? (
//     filteredCities.map((city, index) => (
//       <li
//         key={index}
//         className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
//         onClick={() =>  {
//     if (city === "All Cities") {
//       setSelectedCity(city);
//       navigate("/");
//     } else {
//       setSelectedCity(city);
//       navigate(`/events/city/${city}`);
//     }
//     setIsOpen(false);
//     setSearch("");
//   }}
//       >
//         {city}
//       </li>
//     ))
//   ) : (
//     <li className="px-4 py-2 text-gray-500">
//       No results found
//     </li>
//   )}
// </ul>

//               </div>
//             )}
//           </div>

//           {/* Sign In Button */}
//           {/* <Link
//             to="/signin"
//             className="px-4 py-1.5 bg-[#008CFF] text-white rounded-2xl hover:bg-blue-800 transition"
//           >
//             Sign In
//           </Link> */}
//           {/*Alternative to upper which change sign in and logout when logged in and logged out*/}
//           {/* Sign In Link / Logout Button - Conditional Rendering */}
//           {isAuthenticated ? (
//             <button
//               onClick={() => {
//                 logout();
//                 toast.error("🚪 Logged out successfully!", {
//                   position: "top-right",
//                 });
//                 navigate("/"); // redirect to home after logout
//               }}
//               className="hidden md:block px-4 py-1.5 font-bold border border-red-600 opacity-90 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition"
//             >
//               Logout
//             </button>
//           ) : (
//             <Link
//               to="/signin"
//               className="hidden md:block px-4 py-1.5 font-bold border border-[#008CFF] opacity-90 text-[#008CFF] rounded-xl hover:bg-[#008CFF] hover:text-white transition"
//             >
//               Sign In
//             </Link>
//           )}

//           {/* Hamburger Button */}
//           <button
//             className="p-0.5 rounded-md hover:bg-gray-200"
//             onClick={() => setIsSidebarOpen(true)}
//           >
//             <Menu size={24} />
//           </button>
//         </div>
//       </nav>

//       {/* Overlay - smooth fade-in/out */}
//       <div
//         className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
//           }`}
//         onClick={() => setIsSidebarOpen(false)}
//       ></div>

//       {/* Sidebar Content - smooth slide-in/out */}
//       <div
//         className={`fixed top-0 right-0 w-72 h-full bg-white shadow-lg z-50 p-6 flex flex-col rounded-s-[3vw] transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
//           } ${isSidebarOpen ? "visible" : "invisible"}`}
//       >
//         {/* Close Button */}
//         <button
//           className="absolute top-4 right-4 text-gray-600 hover:text-black"
//           onClick={() => setIsSidebarOpen(false)}
//         >
//           <X size={24} />
//         </button>

//         {/* User Greeting */}
//         {/* <div className="ml-1">
//           <h4 className="text-3xl font-semibold mb-1.5">Hey 👋</h4>
//           {user ? (
//             <h2 className="text-2xl font-semibold">{user.name}</h2>
//           ) : (
//             <div className="space-x-2">
//               <h2 className="text-2xl font-semibold">Guest</h2>
//               <h1 className="text-sm font-semibold text-gray-400">
//                 (Sign In or Sign Up)
//               </h1>
//             </div>
//           )}
//         </div> */}

//         {/*{/*Alternative to upper which change Guest and Full Name when logged in and logged out*/}
//         <div className="ml-1 mt-1">
//           <h4 className="text-3xl font-semibold mb-1.5">Hey 👋</h4>
//           {isAuthenticated && user ? (
//             <h2 className="text-2xl font-semibold mt-2">{user.name}</h2>
//           ) : (
//             <div className="space-x-2">
//               <h2 className="text-2xl font-semibold">Guest!</h2>
//               <h1 className="text-sm font-semibold text-gray-400">
//                 (Sign In or Sign Up)
//               </h1>
//             </div>
//           )}
//         </div>

//         <hr className="mt-3 mb-5 border-black" />

//         {/* Sidebar Options */}
//         <nav className="flex flex-col space-y-4 ml-1 text-bold text-base">
//           {/* <Link
//             to="/categories"
//             className="flex items-center space-x-2 hover:text-[#008CFF]"
//           >
//             <TbCategory className="mr-2 h-5 w-5" /> Categories
//           </Link> */}

//           <div>
//             <button
//               onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
//               className="flex items-center justify-between w-full pr-2 hover:text-[#008CFF]"
//             >
//               <span className="flex items-center">
//                 <TbCategory className="mr-2 h-5 w-5" /> Categories
//               </span>
//               <ChevronDown
//                 size={18}
//                 className={`ml-2 text-gray-600 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`}
//               />
//             </button>

//             {/* Dropdown items */}
//             {isCategoriesOpen && (
//               <ul className="ml-7 mt-2 space-y-2 text-gray-700">
//                 {categories.map((category) => (
//                   <li key={category.name}>
//                     <Link
//                       to={`/events/${category.key}`}
//                       className="flex items-center space-x-2 hover:text-[#008CFF]"
//                       onClick={() => setIsSidebarOpen(false)}
//                     >
//                       {category.icon}
//                       <span>{category.name}</span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {isAuthenticated && (
//             <>
//               <Link
//                 to="/account"
//                 className="flex items-center space-x-2 hover:text-[#008CFF]"
//               >
//                 <CircleUser className="mr-2 h-5 w-5" /> Account
//               </Link>

//               {/* Manage Events Dropdown - Check both accountType and role */}
//               {(user?.accountType === "ORGANIZER" || user?.role === "ORGANIZER") && (
//                 <div>
//                   <button
//                     onClick={() => setIsManageEventsOpen(!isManageEventsOpen)}
//                     className="flex items-center justify-between w-full pr-2 hover:text-[#008CFF]"
//                   >
//                     <span className="flex items-center">
//                       <MdEventNote className="mr-2 h-5 w-5" /> Manage Events
//                     </span>
//                     <ChevronDown
//                       size={18}
//                       className={`ml-2 text-gray-600 transition-transform ${
//                         isManageEventsOpen ? "rotate-180" : ""
//                       }`}
//                     />
//                   </button>

//                   {/* Manage Events Dropdown items */}
//                   {isManageEventsOpen && (
//                     <ul className="ml-7 mt-2 space-y-2 text-gray-700">
//                       <li>
//                         <Link
//                           to="/create-event"
//                           className="flex items-center space-x-2 hover:text-[#008CFF]"
//                           onClick={() => setIsSidebarOpen(false)}
//                         >
//                           <Plus className="h-4 w-4" />
//                           <span>Create an Event</span>
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/your-events"
//                           className="flex items-center space-x-2 hover:text-[#008CFF]"
//                           onClick={() => setIsSidebarOpen(false)}
//                         >
//                           <Eye className="h-4 w-4" />
//                           <span>View Your Events</span>
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/event-history"
//                           className="flex items-center space-x-2 hover:text-[#008CFF]"
//                           onClick={() => setIsSidebarOpen(false)}
//                         >
//                           <Clock className="h-4 w-4" />
//                           <span>Event History</span>
//                         </Link>
//                       </li>
//                     </ul>
//                   )}
//                 </div>
//               )}

//               {user?.role === "USER" && (
//                 <Link to="/history" className="flex items-center space-x-2 hover:text-[#008CFF]">
//                   <History className="mr-2 h-5 w-5" />
//                   Booking History
//                 </Link>
//               )}

//               {user?.role === "ORGANIZER" && (
//                 <Link to="/history" className="flex items-center space-x-2 hover:text-[#008CFF]">
//                   <History className="mr-2 h-5 w-5 mt-0" />
//                   Your Booking History
//                 </Link>
//               )}
//             </>
//           )}
//           {/* Add Logout option in sidebar if authenticated */}
//           {/* {isAuthenticated && (
//             <button
//               onClick={() => {
//                 logout();
//                 setIsSidebarOpen(false);
//                 toast.error("🚪 Logged out successfully!", { position: "top-right" });
//                 navigate('/');
//               }}
//               className="flex items-center space-x-2 hover:text-red-600 text-left"
//             >
//               <X className="mr-2 h-5 w-5" />
//               Logout
//             </button>
//           )} */}
//         </nav>
//         {isAuthenticated ?
//         (
//           <div className="mt-auto border-t pt-4">

//             <button
//               onClick={() => {
//                 logout();
//                 setIsSidebarOpen(false);
//                 toast.error("🚪 Logged out successfully!", {
//                   position: "top-right",
//                 });
//                 navigate("/");
//               }}
//               className="flex items-center space-x-2  hover:text-red-600 text-left w-full ml-1.5 text-bold text-bold">
//               <RiLogoutCircleLine className="mr-2 h-5 w-5" /> Logout
//             </button>
//           </div>
//         )
//         :

//         (
//           <div className="mt-auto border-t pt-4">

//             <button
//               onClick={() => {
//                 setIsSidebarOpen(false);
//                 navigate("/signin");
//               }}
//               className="flex items-center space-x-2  hover:text-[#008cff]  text-left w-full ml-1.5 text-bold text-bold">
//               <RiLogoutCircleLine className="mr-2 h-5 w-5" /> Sign in
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Navbar;

// import React, { useState } from "react";
// import { Menu, ChevronDown, MapPin, Search, X } from "lucide-react";
// import { TbCategory } from "react-icons/tb";
// import { Link } from "react-router-dom";

// const Navbar = () => {
//   const [selectedCity, setSelectedCity] = useState("Select City");
//   const [search, setSearch] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // Simulating logged in user (replace with real auth later)
//   const [user, setUser] = useState(null); // null = guest | {name: "Vivek"}

//   const cities = [
//     "Mumbai",
//     "Delhi",
//     "Bengaluru",
//     "Hyderabad",
//     "Chennai",
//     "Kolkata",
//     "Pune",
//     "Ahmedabad",
//     "Jaipur",
//     "Lucknow",
//   ];

//   const filteredCities = cities.filter((city) =>
//     city.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <>
//       <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md md:px-11">
//         {/* Left side - Logo + Text */}
//         <div className="flex items-center space-x-3">
//           <img
//             src="../Images/QuiketsyLogo.png"
//             alt="Quiketsy Logo"
//             height={100}
//             width={100}
//             className="hidden md:block"
//           />
//           <div className="text-2xl font-bold text-blue-700">Quiketsy</div>
//         </div>

//         {/* Right side - Search + City Selector + Links + Buttons */}
//         <div className="flex items-center space-x-4">
//           {/* Search Bar */}
//           <div className="relative hidden md:block">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <Search size={20} className="text-gray-500" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search events, concerts..."
//               className="w-64 pl-10 pr-4 py-1.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           {/* City Selector */}
//           <div className="relative flex items-center cursor-pointer ml-1">
//             <MapPin size={18} className="text-[#008CFF] mr-1" />
//             <span className="text-gray-800" onClick={() => setIsOpen(!isOpen)}>
//               {selectedCity}
//             </span>
//             <ChevronDown
//               size={18}
//               className={`ml-1 text-gray-600 transition-transform duration-200 ${
//                 isOpen ? "rotate-180" : ""
//               }`}
//               onClick={() => setIsOpen(!isOpen)}
//             />

//             {isOpen && (
//               <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
//                 {/* Search bar */}
//                 <input
//                   type="text"
//                   placeholder="Search city..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="w-full px-3 py-2 border-b outline-none"
//                 />

//                 {/* City List */}
//                 <ul className="max-h-60 overflow-y-auto">
//                   {filteredCities.length > 0 ? (
//                     filteredCities.map((city, index) => (
//                       <li
//                         key={index}
//                         className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
//                         onClick={() => {
//                           setSelectedCity(city);
//                           setIsOpen(false);
//                           setSearch("");
//                         }}
//                       >
//                         {city}
//                       </li>
//                     ))
//                   ) : (
//                     <li className="px-4 py-2 text-gray-500">
//                       No results found
//                     </li>
//                   )}
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Sign In Button */}
//           <Link
//             to="/signin"
//             className="px-4 py-1.5 bg-[#008CFF] text-white rounded-2xl hover:bg-blue-800 transition"
//           >
//             Sign In
//           </Link>

//           {/* Hamburger Button */}
//           <button
//             className="p-0.5 rounded-md hover:bg-gray-200"
//             onClick={() => setIsSidebarOpen(true)}
//           >
//             <Menu size={24} />
//           </button>
//         </div>
//       </nav>

//       {/* Sidebar */}
//       {isSidebarOpen && (
//         <>
//           {/* Overlay */}
//           <div
//             className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
//           isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//         }`}
//             onClick={() => setIsSidebarOpen(false)}
//           ></div>

//           {/* Sidebar Content */}
//           <div className={`fixed top-0 right-0 w-72 h-full bg-white shadow-lg z-50 p-6 flex flex-col rounded-s-[3vw] transform transition-transform duration-100 ease-in-out ${
//           isSidebarOpen ? "translate-x-0" : "translate-x-full"
//         }`}>
//             {/* Close Button */}
//             <button
//               className="absolute top-4 right-4 text-gray-600 hover:text-black"
//               onClick={() => setIsSidebarOpen(false)}
//             >
//               <X size={24} />
//             </button>

//             {/* User Greeting */}
//             {/* <h2 className="text-xl font-semibold mb-6">
//               {user ? `Hey, ${user.name}` : "Hey Guest"}
//             </h2> */}

//             <div className="ml-1">
//               <h4 className="text-3xl font-semibold mb-1.5">Hey 👋</h4>
//               {user ? (
//                 <h2 className="text-2xl font-semibold">{user.name}</h2>
//               ) : (
//                 <div className="space-x-2">
//                 <h2 className="text-2xl font-semibold">Guest</h2>
//                 <h1 className="text-sm font-semibold text-gray-400">(Sign In or Sign Up)</h1>
//                 </div>

//               )}
//             </div>
//             <hr className="my-5 border-black" />

//             {/* <div
//   className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-6 transform transition-transform duration-300 ease-in-out
//   ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
// > */}
//             {/* Close button */}
//             {/* <button
//     onClick={() => setIsSidebarOpen(false)}
//     className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
//   >
//     ✕
//   </button> */}

//             {/* Greeting Section */}
//             {/* <div className="mb-6">
//     <h2 className="text-2xl font-bold">Hey 👋,</h2>
//     <p className="text-lg text-gray-800">
//       {typeof username !== "undefined" ? username : "Guest"}
//     </p>
//   </div> */}

//             {/* Separator */}
//             {/* <hr className="my-4 border-gray-300" /> */}

//             {/* Sidebar Options */}
//             <nav className="flex flex-col space-y-4 ml-4">
//               <Link to="/categories" className="hover:text-[#008CFF]">
//                 Categories
//               </Link>
//               <Link to="/account" className="hover:text-[#008CFF]">
//                 Account
//               </Link>
//               <Link to="/history" className="hover:text-[#008CFF]">
//                 History
//               </Link>
//             </nav>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default Navbar;

// import React, { useState } from "react";
// import { Menu, ChevronDown, MapPin, Search} from "lucide-react";
// import { TbCategory } from "react-icons/tb";
// import { Link } from "react-router-dom";

// const Navbar = () => {
//   const [selectedCity, setSelectedCity] = useState("Select City");
//   const [search, setSearch] = useState("");
//   const [isOpen, setIsOpen] = useState(false);

//   const cities = [
//     "Mumbai",
//     "Delhi",
//     "Bengaluru",
//     "Hyderabad",
//     "Chennai",
//     "Kolkata",
//     "Pune",
//     "Ahmedabad",
//     "Jaipur",
//     "Lucknow",
//   ];

//   const filteredCities = cities.filter((city) =>
//     city.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md md:px-11">
//       {/* Left side - Logo + Text */}
//       <div className="flex items-center space-x-3">
//         <img
//           src="../Images/QuiketsyLogo.png"
//           alt="Quiketsy Logo"
//           height={100}
//           width={100}
//           className="hidden md:block"
//         />
//         <div className="text-2xl font-bold text-blue-700">Quiketsy</div>
//       </div>

//       {/* Right side - Search + City Selector + Links + Buttons */}
//       <div className="flex items-center space-x-4">
//         {/* Search Bar - only on md+ */}
//         <div className="relative hidden md:block">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <Search size={20} className="text-gray-500" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search events, concerts..."
//             className="w-64 pl-10 pr-4 py-1.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         {/* City Selector (text + arrow) */}
//         <div className="relative flex items-center cursor-pointer ml-1">
//           <MapPin size={18} className="text-[#008CFF] mr-1" />
//           <span className="text-gray-800" onClick={() => setIsOpen(!isOpen)}>
//             {selectedCity}
//           </span>
//           <ChevronDown
//             size={18}
//             className={`ml-1 text-gray-600 transition-transform duration-200 ${
//               isOpen ? "rotate-180" : ""
//             }`}
//             onClick={() => setIsOpen(!isOpen)}
//           />

//           {isOpen && (
//             <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
//               {/* Search bar */}
//               <input
//                 type="text"
//                 placeholder="Search city..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full px-3 py-2 border-b outline-none"
//               />

//               {/* City List */}
//               <ul className="max-h-60 overflow-y-auto">
//                 {filteredCities.length > 0 ? (
//                   filteredCities.map((city, index) => (
//                     <li
//                       key={index}
//                       className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
//                       onClick={() => {
//                         setSelectedCity(city);
//                         setIsOpen(false);
//                         setSearch("");
//                       }}
//                     >
//                       {city}
//                     </li>
//                   ))
//                 ) : (
//                   <li className="px-4 py-2 text-gray-500">No results found</li>
//                 )}
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* Events Button - only on md+ */}
//         {/* <TbCategory size={20} className="text-[#008CFF] mr-2"/>
//         <button className="hidden md:block text-blue-700 hover:text-blue-800 font-medium">
//           Events
//         </button> */}

//         {/* Sign In Button */}
//         <Link
//           to="/signin"
//           className="px-4 py-1.5 bg-[#008CFF] text-white rounded-2xl hover:bg-blue-800 transition"
//         >
//           Sign In
//         </Link>

//         {/* Hamburger Button */}
//         <button className="p-0.5 rounded-md hover:bg-gray-200">
//           <Menu size={24} />
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
