import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { MapPin, Clock, Users, DollarSign, ChevronLeft } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:9192";

const ViewEvents = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not an organizer
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      toast.error("Please login to view your events");
    } else if (user?.accountType !== "ORGANIZER" && user?.role !== "ORGANIZER") {
      navigate("/");
      toast.error("Only organizers can view their events");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch active events when user is ready
  useEffect(() => {
    if (user?.id) {
      fetchActiveEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchActiveEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE}/api/events/organizer/${user?.id}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch events (${response.status})`);
      }

      const data = await response.json();

      // Normalize IDs so we can safely use event.id everywhere
      const normalized = (Array.isArray(data) ? data : []).map((e) => ({
        ...e,
        id: e.eventId ?? e.id, // prefer eventId
      }));

      const activeEvents = normalized.filter(
        (event) => event.status === "UPCOMING"
      );

      setEvents(activeEvents);
    } catch (error) {
      console.error("Error fetching active events:", error);
      toast.error("Could not load events. Showing sample data.");
      const dummyEvents = getDummyEvents();
      setEvents(dummyEvents.filter((e) => e.status === "UPCOMING"));
    } finally {
      setLoading(false);
    }
  };

  // Dummy data for testing (status matches filter and includes eventId)
  const getDummyEvents = () => [
    {
      eventId: "1",
      id: "1",
      name: "Tech Summit 2025",
      status: "UPCOMING",
      eventDate: "2025-03-15",
      startTime: "10:00:00",
      ticketPrice: 2500,
      venue: "Mumbai Convention Center",
      duration: "8 hours",
      totalSlots: 500,
    },
    {
      eventId: "2",
      id: "2",
      name: "Music Festival",
      status: "UPCOMING",
      eventDate: "2025-04-20",
      startTime: "18:00:00",
      ticketPrice: 3500,
      venue: "Delhi Stadium",
      duration: "6 hours",
      totalSlots: 5000,
    },
    {
      eventId: "3",
      id: "3",
      name: "Stand-up Comedy Night",
      status: "UPCOMING",
      eventDate: "2025-02-14",
      startTime: "20:00:00",
      ticketPrice: 1200,
      venue: "Bangalore Auditorium",
      duration: "3 hours",
      totalSlots: 300,
    },
  ];

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format time (supports "HH:mm" and "HH:mm:ss")
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [h, m] = timeString.split(":");
    const hour = parseInt(h, 10);
    const minutes = m ?? "00";
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = ((hour + 11) % 12) + 1; // 0→12, 13→1
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Your Active Events</h1>
          <p className="text-gray-600 mt-2">
            Manage and view all your currently active events
          </p>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">You don't have any active events</p>
            <button
              onClick={() => navigate("/create-event")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create New Event
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                {/* Event Header */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {event.name}
                  </h2>
                  <div className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-lg text-sm font-medium">
                    <span className="font-semibold">Upcoming:</span>{" "}
                    {formatDate(event.eventDate)} | {formatTime(event.startTime)}
                  </div>
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  {/* Price */}
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="font-medium">₹{event.ticketPrice}</p>
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Venue</p>
                      <p className="font-medium">{event.venue}</p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-medium">{event.duration}</p>
                    </div>
                  </div>

                  {/* Total Slots */}
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Total Slots</p>
                      <p className="font-medium">{event.totalSlots}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t flex items-center gap-2">
                  <button
                    onClick={() => {
                      // Ensure we navigate with a valid id
                      const idToUse = event.id || event.eventId;
                      if (!idToUse) {
                        toast.error("Missing event ID");
                        return;
                      }
                      navigate(`/event/${idToUse}`);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors cursor-pointer"
                  >
                    View Event Details
                  </button>

                  <span className="text-gray-300">|</span>

                  <button
                    onClick={() => navigate(`/edit-event/${event.id || event.eventId}`)}
                    className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors cursor-pointer"
                  >
                    Edit Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FAB */}
        {events.length > 0 && (
          <button
            onClick={() => navigate("/create-event")}
            className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center"
            title="Create New Event"
          >
            <span className="text-2xl">+</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ViewEvents;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { 
//   Calendar, 
//   MapPin, 
//   Clock, 
//   Users, 
//   DollarSign,
//   ChevronLeft,
//   Edit,
//   Eye
// } from "lucide-react";
// import { PiDotDuotone } from "react-icons/pi";
// import LoadingSpinner from "./LoadingSpinner";
// import { toast } from "react-toastify";

// const ViewEvents = () => {
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useAuth();
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Redirect if not an organizer
//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/");
//       toast.error("Please login to view your events");
//     } else if (user?.accountType !== "ORGANIZER" && user?.role !== "ORGANIZER") {
//       navigate("/");
//       toast.error("Only organizers can view their events");
//     }
//   }, [isAuthenticated, user, navigate]);

//   // Fetch active events
//   useEffect(() => {
//     if (user?.id) {
//       fetchActiveEvents();
//     }
//   }, []);

//   const fetchActiveEvents = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
      
//       // Replace with your actual API endpoint
//       const response = await fetch(`http://localhost:9192/api/events/organizer/${user?.id}`, {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         // Filter only active events
//         const activeEvents = data.filter(event => event.status=== 'UPCOMING');
//         setEvents(activeEvents);
//       } else {
//         // Fallback to dummy data for testing
//         const dummyEvents = getDummyEvents();
//         const activeEvents = dummyEvents.filter(event => event.status === 'UPCOMING');
//         setEvents(activeEvents);
//       }
//     } catch (error) {
//       console.error("Error fetching active events:", error);
//       // Use dummy data if API fails
//       const dummyEvents = getDummyEvents();
//       const activeEvents = dummyEvents.filter(event => event.status === 'UPCOMING');
//       setEvents(activeEvents);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Dummy data for testing
//   const getDummyEvents = () => [
//     {
//       id: 1,
//       name: "Tech Summit 2025",
//       status: "active",
//       date: "2025-03-15",
//       time: "10:00",
//       price: 2500,
//       venue: "Mumbai Convention Center",
//       duration: 8,
//       totalSlots: 500
//     },
//     {
//       id: 2,
//       name: "Music Festival",
//       status: "active",
//       date: "2025-04-20",
//       time: "18:00",
//       price: 3500,
//       venue: "Delhi Stadium",
//       duration: 6,
//       totalSlots: 5000
//     },
//     {
//       id: 3,
//       name: "Stand-up Comedy Night",
//       status: "active",
//       date: "2025-02-14",
//       time: "20:00",
//       price: 1200,
//       venue: "Bangalore Auditorium",
//       duration: 3,
//       totalSlots: 300
//     },
//     {
//       id: 4,
//       name: "Food & Wine Festival",
//       status: "active",
//       date: "2025-05-01",
//       time: "12:00",
//       price: 1500,
//       venue: "Goa Beach Resort",
//       duration: 10,
//       totalSlots: 2000
//     },
//     {
//       id: 5,
//       name: "Art Workshop",
//       status: "active",
//       date: "2025-03-25",
//       time: "15:00",
//       price: 800,
//       venue: "Chennai Art Studio",
//       duration: 4,
//       totalSlots: 50
//     }
//   ];

//   // Format date
//   const formatDate = (dateString) => {
//     const options = { day: 'numeric', month: 'short', year: 'numeric' };
//     return new Date(dateString).toLocaleDateString('en-US', options);
//   };

//   // Format time
//   const formatTime = (timeString) => {
//     if (!timeString) return '';
//     const [hours, minutes] = timeString.split(':');
//     const hour = parseInt(hours);
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
//     return `${displayHour}:${minutes} ${ampm}`;
//   };

//   if (loading) {
//     return <LoadingSpinner fullPage />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
//           >
//             <ChevronLeft className="w-5 h-5 mr-1" />
//             Back
//           </button>
//           <h1 className="text-3xl font-bold text-gray-900">Your Active Events</h1>
//           <p className="text-gray-600 mt-2">Manage and view all your currently active events</p>
//         </div>

//         {/* Events List */}
//         {events.length === 0 ? (
//           <div className="bg-white rounded-lg shadow p-8 text-center">
//             <p className="text-gray-500 text-lg">You don't have any active events</p>
//             <button
//               onClick={() => navigate('/create-event')}
//               className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Create New Event
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {events.map((event) => (
//               <div 
//                 key={event.id}
//                 className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
//               >
//                 {/* Event Header - Name and Active Status with Date/Time */}
//                 <div className="flex justify-between items-start mb-4">
//                   <h2 className="text-xl font-bold text-gray-900">
//                     {event.name}
//                   </h2>
//                   {/* <PiDotDuotone className="text-red-500 h-15 w-15" /> */}
//                   <div className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-lg text-sm font-medium">
//                     <span className="font-semibold">Active:</span> {formatDate(event.eventDate)} | {formatTime(event.startTime)}
//                   </div>
//                 </div>

//                 {/* Event Details */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
//                   {/* Price */}
//                   <div className="flex items-center text-gray-600">
//                     <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
//                     <div>
//                       <p className="text-xs text-gray-500">Price</p>
//                       <p className="font-medium">₹{event.ticketPrice}</p>
//                     </div>
//                   </div>

//                   {/* Venue */}
//                   <div className="flex items-center text-gray-600">
//                     <MapPin className="w-4 h-4 mr-2 text-gray-400" />
//                     <div>
//                       <p className="text-xs text-gray-500">Venue</p>
//                       <p className="font-medium">{event.venue}</p>
//                     </div>
//                   </div>

//                   {/* Duration */}
//                   <div className="flex items-center text-gray-600">
//                     <Clock className="w-4 h-4 mr-2 text-gray-400" />
//                     <div>
//                       <p className="text-xs text-gray-500">Duration</p>
//                       <p className="font-medium">{event.duration}</p>
//                     </div>
//                   </div>

//                   {/* Total Slots */}
//                   <div className="flex items-center text-gray-600">
//                     <Users className="w-4 h-4 mr-2 text-gray-400" />
//                     <div>
//                       <p className="text-xs text-gray-500">Total Slots</p>
//                       <p className="font-medium">{event.totalSlots}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Options */}
//                 <div className="pt-4 border-t flex items-center gap-2">
//                   <button
//                     onClick={() => navigate(`/event/${event}`)}
//                     className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
//                   >
//                     View Event Details
//                   </button>
                  
//                   <span className="text-gray-300">|</span>
                  
//                   <button
//                     onClick={() => navigate(`/edit-event/${event.id}`)}
//                     className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors"
//                   >
//                     Edit Event
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Floating Action Button for Create Event */}
//         {events.length > 0 && (
//           <button
//             onClick={() => navigate('/create-event')}
//             className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center"
//             title="Create New Event"
//           >
//             <span className="text-2xl">+</span>
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewEvents;