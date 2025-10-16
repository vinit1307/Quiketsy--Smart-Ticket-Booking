// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { 
//   Calendar, 
//   MapPin, 
//   Clock, 
//   Users, 
//   DollarSign,
//   ChevronLeft
// } from "lucide-react";
// import LoadingSpinner from "./LoadingSpinner";
// import { toast } from "react-toastify";

// const EventHistory = () => {
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useAuth();
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Redirect if not an organizer
//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/");
//       toast.error("Please login to view event history");
//     } else if (user?.accountType !== "ORGANIZER" && user?.role !== "ORGANIZER") {
//       navigate("/");
//       toast.error("Only organizers can view event history");
//     }
//   }, [isAuthenticated, user, navigate]);

//   // Fetch event history
//   useEffect(() => {
//     fetchEventHistory();
//   }, []);

//   const fetchEventHistory = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
      
//       // Replace with your actual API endpoint
//       const response = await fetch("http://localhost:9192/api/events/organizer/history", {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setEvents(data);
//       } else {
//         // Fallback to dummy data for testing
//         setEvents(getDummyEvents());
//       }
//     } catch (error) {
//       console.error("Error fetching event history:", error);
//       // Use dummy data if API fails
//       setEvents(getDummyEvents());
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Dummy data for testing
//   const getDummyEvents = () => [
//     {
//       id: 1,
//       name: "Rock Concert 2024",
//       status: "completed",
//       date: "2024-01-15",
//       price: 1500,
//       venue: "Mumbai Stadium",
//       duration: 3,
//       totalSlots: 500
//     },
//     {
//       id: 2,
//       name: "Tech Conference",
//       status: "upcoming",
//       date: "2024-12-25",
//       price: 2500,
//       venue: "Delhi Convention Center",
//       duration: 8,
//       totalSlots: 200
//     },
//     {
//       id: 3,
//       name: "Comedy Night",
//       status: "cancelled",
//       date: "2024-02-20",
//       price: 800,
//       venue: "Bangalore Comedy Club",
//       duration: 2,
//       totalSlots: 150
//     },
//     {
//       id: 4,
//       name: "Food Festival",
//       status: "upcoming",
//       date: "2024-12-30",
//       price: 500,
//       venue: "Hyderabad Grounds",
//       duration: 6,
//       totalSlots: 1000
//     },
//     {
//       id: 5,
//       name: "Art Exhibition",
//       status: "COMPLETED",
//       date: "2024-01-10",
//       price: 300,
//       venue: "Chennai Art Gallery",
//       duration: 4,
//       totalSlots: 100
//     }
//   ];

//   // Get status badge color
//   const getStatusColor = (status) => {
//     switch(status?.toLowerCase()) {
//       case 'upcoming':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'completed':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800 border-red-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString('en-US', options);
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
//           <h1 className="text-3xl font-bold text-gray-900">Event History</h1>
//           <p className="text-gray-600 mt-2">View all your past and current events</p>
//         </div>

//         {/* Events List */}
//         {events.length === 0 ? (
//           <div className="bg-white rounded-lg shadow p-8 text-center">
//             <p className="text-gray-500 text-lg">No events found in your history</p>
//             <button
//               onClick={() => navigate('/create-event')}
//               className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Create Your First Event
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {events.map((event) => (
//               <div 
//                 key={event.id}
//                 className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
//               >
//                 {/* Event Header - Name and Status */}
//                 <div className="flex justify-between items-start mb-4">
//                   <h2 className="text-xl font-bold text-gray-900">
//                     {event.name}
//                   </h2>
//                   <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
//                     {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
//                   </span>
//                 </div>

//                 {/* Event Details */}
//                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
//                   {/* Date */}
//                   <div className="flex items-center text-gray-600">
//                     <Calendar className="w-4 h-4 mr-2 text-gray-400" />
//                     <div>
//                       <p className="text-xs text-gray-500">Date</p>
//                       <p className="font-medium">{formatDate(event.date)}</p>
//                     </div>
//                   </div>

//                   {/* Price */}
//                   <div className="flex items-center text-gray-600">
//                     <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
//                     <div>
//                       <p className="text-xs text-gray-500">Price</p>
//                       <p className="font-medium">₹{event.price}</p>
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
//                       <p className="font-medium">{event.duration} hours</p>
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
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EventHistory;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  ChevronLeft,
  Tag,
  Globe,
  Activity
} from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";

const EventHistory = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, isInitialized } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not an organizer
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate("/");
  //     toast.error("Please login to view event history");
  //   } else if (user?.accountType !== "ORGANIZER" && user?.role !== "ORGANIZER") {
  //     navigate("/");
  //     toast.error("Only organizers can view event history");
  //   }
  // }, [isAuthenticated, user, navigate]);
useEffect(() => {
  // Wait for auth to initialize before checking
  if (!authLoading && isInitialized) {
    if (!isAuthenticated) {
      navigate("/");
      toast.error("Please login to view event history");
    } else if (user?.accountType !== "ORGANIZER" && user?.role !== "ORGANIZER") {
      navigate("/");
      toast.error("Only organizers can view event history");
    }
  }
}, [isAuthenticated, user, navigate, authLoading, isInitialized]);

  // Fetch event history when user is available
  // useEffect(() => {
  //   if (user?.id) {
  //     fetchEventHistory();
  //   }
  // }, [user?.id]);
  useEffect(() => {
  // Only fetch if auth is initialized and user has an ID
  if (!authLoading && isInitialized && user?.id) {
    fetchEventHistory();
  } else if (!authLoading && isInitialized && !user?.id && isAuthenticated) {
    // Auth is ready but no user ID
    console.error("User authenticated but no ID found");
    setError("Unable to get user ID");
    setLoading(false);
  }
}, [user?.id, authLoading, isInitialized, isAuthenticated]);

  const fetchEventHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      
      // Use the actual endpoint with user ID
      const response = await fetch(`http://localhost:9192/api/events/organizer/${user.id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched events:", data); // Debug log
        
        // Map the backend data to match your component's expected format
        const formattedEvents = data.map(event => ({
          id: event.eventId || event.id,
          name: event.name,
          status: event.status || 'UPCOMING',
          date: event.eventDate,
          price: event.ticketPrice || event.price,
          venue: event.venue,
          city: event.city,
          duration: event.duration,
          totalSlots: event.totalSlots,
          availableSlots: event.availableSlots,
          category: event.category,
          language: event.language,
          imageUrl: event.imageUrl,
          description: event.description,
          startTime: event.startTime,
          ageLimit: event.ageLimit,
          tags: event.tags,
          isTrending: event.isTrending
        }));
        
        setEvents(formattedEvents);
      } else if (response.status === 404) {
        // No events found for this organizer
        setEvents([]);
      } else {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching event history:", error);
      setError(error.message);
      toast.error("Failed to load event history");
      // Optionally use dummy data for development
      // setEvents(getDummyEvents());
    } finally {
      setLoading(false);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'UPCOMING':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ONGOING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time
  const formatTime = (timeStr) => {
    if (!timeStr) return "TBA";
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Parse duration string (e.g., "2 hours" -> 2)
  const parseDuration = (duration) => {
    if (typeof duration === 'number') return duration;
    if (typeof duration === 'string') {
      const match = duration.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  };

  // Calculate booked percentage
  const getBookedPercentage = (totalSlots, availableSlots) => {
    if (!totalSlots) return 0;
    return Math.round(((totalSlots - availableSlots) / totalSlots) * 100);
  };

  if (authLoading || !isInitialized) {
  return <LoadingSpinner fullPage />;
}

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-red-600 text-lg mb-4">Error: {error}</p>
            <button
              onClick={fetchEventHistory}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Event History</h1>
              <p className="text-gray-600 mt-2">
                View all your oraganized events.
          </p>
              <p className="text-gray-600">
                Organized <b>{events.length}</b> event{events.length !== 1 ? 's' : ''} till now
              </p>
            </div>
            <button
              onClick={() => navigate('/create-event')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Event
            </button>
          </div>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No events found in your history</p>
            <button
              onClick={() => navigate('/create-event')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div 
                key={event.id}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all transition transform hover:shadow-cyan-500/50 hover:shadow-2xl"
                // onClick={() => navigate(`/event/${event.id}`)}
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Event Image */}
                  {event.imageUrl && (
                    <div className="md:w-32 md:h-32 flex-shrink-0">
                      <img 
                        src={event.imageUrl} 
                        alt={event.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    {/* Event Header - Name and Status */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {event.name}
                        </h2>
                        {event.category && (
                          <span className="text-sm text-gray-500 capitalize">
                            {event.category}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {/* {event.isTrending && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                            🔥 Trending
                          </span>
                        )} */}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm mb-4">
                      {/* Date */}
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="font-medium">{formatDate(event.date)}</p>
                        </div>
                      </div>

                      {/* Time */}
                      {event.startTime && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Time</p>
                            <p className="font-medium">{formatTime(event.startTime)}</p>
                          </div>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="font-medium">₹{event.price}</p>
                        </div>
                      </div>

                      {/* Venue */}
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Venue</p>
                          <p className="font-medium truncate" title={`${event.venue}${event.city ? ', ' + event.city : ''}`}>
                            {event.venue}
                          </p>
                        </div>
                      </div>

                      {/* Duration */}
                      {event.duration && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="font-medium">{event.duration}</p>
                          </div>
                        </div>
                      )}

                      {/* Slots */}
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Slots</p>
                          <p className="font-medium">
                            {event.availableSlots}/{event.totalSlots}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Booking Progress Bar */}
                    {event.totalSlots && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Bookings</span>
                          <span>{getBookedPercentage(event.totalSlots, event.availableSlots)}% Booked</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              getBookedPercentage(event.totalSlots, event.availableSlots) > 80 ? 'bg-green-500' :
                              getBookedPercentage(event.totalSlots, event.availableSlots) > 50 ? 'bg-blue-500' :
                              'bg-gray-400'
                            }`}
                            style={{ width: `${getBookedPercentage(event.totalSlots, event.availableSlots)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {event.tags && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {event.tags.split(',').filter(tag => tag.trim()).slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventHistory;