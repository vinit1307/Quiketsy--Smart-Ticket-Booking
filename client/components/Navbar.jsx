import React, { useState } from "react";
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

const Navbar = () => {
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Simulating logged in user (replace with real auth later)
  //const [user, setUser] = useState(null); // null = guest | {name: "Vivek"}

  //Better approach use kar rahe he local state ki jagah auth pe jaake
  //alternative to above, agar dikkat aaye to vaapas vo use kar lenge
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth(); // Use auth context instead of local state

  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isManageEventsOpen, setIsManageEventsOpen] = useState(false);

  const categories = [
    { key: 'music', name: "Music", icon: <GiGuitar className="h-4 w-4" /> },
    { key: 'sports', name: "Sports", icon: <MdSportsGymnastics className="h-4 w-4" /> },
    { key: 'plays',name: "Plays", icon: <LuDrama className="h-4 w-4" /> },
    { key: 'standup', name: "Stand Up Comedy", icon: <FaFaceLaughSquint className="h-4 w-4" /> },
    {key: 'art', name: 'Arts & Culture', icon: <Palette className="h-4 w-4" />},
  { key: 'technology', name: 'Technology', icon: <FaLaptopCode className="h-4 w-4" />},
  { key: 'workshop', name: 'Workshops', icon: <GrWorkshop className="h-4 w-4" />},
  ];

  const cities = [
    "All Cities",
    "Mumbai",
    "Indore",
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
    <>
      <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md md:px-11">
        {/* Left side - Logo + Text */}
        <Link to="/">
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
        </Link>

        {/* Right side - Search + City Selector + Links + Buttons */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={20} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search events, concerts..."
              className="w-64 pl-10 pr-4 py-1.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* City Selector */}
          <div className="relative flex items-center cursor-pointer ml-1">
            <MapPin size={18} className="text-blue-600 mr-1" />
            <span className="text-gray-800" onClick={() => setIsOpen(!isOpen)}>
              {selectedCity}
            </span>
            <ChevronDown
              size={18}
              className={`ml-1 text-gray-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
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
            className="px-4 py-1.5 bg-blue-700 text-white rounded-2xl hover:bg-blue-800 transition"
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
              className="px-4 py-1.5 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/signin"
              className="px-4 py-1.5 bg-blue-700 text-white rounded-2xl hover:bg-blue-800 transition"
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
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar Content - smooth slide-in/out */}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-white shadow-lg z-50 p-6 flex flex-col rounded-s-[3vw] transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } ${isSidebarOpen ? "visible" : "invisible"}`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={24} />
        </button>

        {/* User Greeting */}
        {/* <div className="ml-1">
          <h4 className="text-3xl font-semibold mb-1.5">Hey 👋</h4>
          {user ? (
            <h2 className="text-2xl font-semibold">{user.name}</h2>
          ) : (
            <div className="space-x-2">
              <h2 className="text-2xl font-semibold">Guest</h2>
              <h1 className="text-sm font-semibold text-gray-400">
                (Sign In or Sign Up)
              </h1>
            </div>
          )}
        </div> */}

        {/*{/*Alternative to upper which change Guest and Full Name when logged in and logged out*/}
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

        <hr className="mt-5 mb-5 border-black" />

        {/* Sidebar Options */}
        <nav className="flex flex-col space-y-4 ml-1 text-bold text-base">
          {/* <Link
            to="/categories"
            className="flex items-center space-x-2 hover:text-blue-600"
          >
            <TbCategory className="mr-2 h-5 w-5" /> Categories
          </Link> */}

          <div>
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="flex items-center justify-between w-full pr-2 hover:text-blue-600"
            >
              <span className="flex items-center">
                <TbCategory className="mr-2 h-5 w-5" /> Categories
              </span>
              <ChevronDown
                size={18}
                className={`ml-2 text-gray-600 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown items */}
            {isCategoriesOpen && (
              <ul className="ml-7 mt-2 space-y-2 text-gray-700">
                {categories.map((category) => (
                  <li key={category.name}>
                    <Link
                      to={`/events/${category.key}`}
                      className="flex items-center space-x-2 hover:text-blue-600"
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
                className="flex items-center space-x-2 hover:text-blue-600"
              >
                <CircleUser className="mr-2 h-5 w-5" /> Account
              </Link>

              {/* Manage Events Dropdown - Check both accountType and role */}
              {(user?.accountType === "ORGANIZER" || user?.role === "ORGANIZER") && (
                <div>
                  <button
                    onClick={() => setIsManageEventsOpen(!isManageEventsOpen)}
                    className="flex items-center justify-between w-full pr-2 hover:text-blue-600"
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
                          className="flex items-center space-x-2 hover:text-blue-600"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <Plus className="h-4 w-4" />
                          <span>Create an Event</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/your-events"
                          className="flex items-center space-x-2 hover:text-blue-600"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Your Events</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/event-history"
                          className="flex items-center space-x-2 hover:text-blue-600"
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
                <Link to="/history" className="flex items-center space-x-2 hover:text-blue-600">
                  <History className="mr-2 h-5 w-5" />
                  Booking History
                </Link>
              )}

              {user?.role === "ORGANIZER" && (
                <Link to="/history" className="flex items-center space-x-2 hover:text-blue-600">
                  <History className="mr-2 h-5 w-5 mt-0" />
                  Your Booking History
                </Link>
              )}
            </>
          )}
          {/* Add Logout option in sidebar if authenticated */}
          {/* {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                setIsSidebarOpen(false);
                toast.error("🚪 Logged out successfully!", { position: "top-right" });
                navigate('/');
              }}
              className="flex items-center space-x-2 hover:text-red-600 text-left"
            >
              <X className="mr-2 h-5 w-5" />
              Logout
            </button>
          )} */}
        </nav>
        {isAuthenticated && (
          <div className="mt-auto border-t pt-4">

            <button
              onClick={() => {
                logout();
                setIsSidebarOpen(false);
                toast.error("🚪 Logged out successfully!", {
                  position: "top-right",
                });
                navigate("/");
              }}
              className="flex items-center space-x-2  hover:text-red-600 text-left w-full ml-1.5 text-bold text-bold">
              <RiLogoutCircleLine className="mr-2 h-5 w-5" /> Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;

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
//             <MapPin size={18} className="text-blue-600 mr-1" />
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
//             className="px-4 py-1.5 bg-blue-700 text-white rounded-2xl hover:bg-blue-800 transition"
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
//               <Link to="/categories" className="hover:text-blue-600">
//                 Categories
//               </Link>
//               <Link to="/account" className="hover:text-blue-600">
//                 Account
//               </Link>
//               <Link to="/history" className="hover:text-blue-600">
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
//           <MapPin size={18} className="text-blue-600 mr-1" />
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
//         {/* <TbCategory size={20} className="text-blue-600 mr-2"/>
//         <button className="hidden md:block text-blue-700 hover:text-blue-800 font-medium">
//           Events
//         </button> */}

//         {/* Sign In Button */}
//         <Link
//           to="/signin"
//           className="px-4 py-1.5 bg-blue-700 text-white rounded-2xl hover:bg-blue-800 transition"
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
