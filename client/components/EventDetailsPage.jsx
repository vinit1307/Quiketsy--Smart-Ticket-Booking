import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiParentLine } from "react-icons/ri";
import { GiDuration } from "react-icons/gi";
import { MdTimelapse } from "react-icons/md";
import { IoTicket } from "react-icons/io5";
import { FaCity, FaLanguage } from "react-icons/fa";
import { AiOutlineTags } from "react-icons/ai";
import { MdEventAvailable } from "react-icons/md";
import EventsService from "../services/eventsService";
import LoadingSpinner from "./LoadingSpinner";
import { ListEnd } from "lucide-react";

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [queuePosition, setQueuePosition] = useState(null);
const [loadingPosition, setLoadingPosition] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const eventData = await EventsService.getEventById(id);

        if (eventData) {
          // Format the event data based on your backend response
          const formattedEvent = {
            id: eventData.eventId || eventData.id,
            name: eventData.name,
            venue: eventData.venue,
            city: eventData.city,
            date: eventData.eventDate,
            startTime: eventData.startTime,
            image: eventData.imageUrl,
            price: eventData.ticketPrice,
            duration: eventData.duration,
            ageLimit: eventData.ageLimit,
            description: eventData.description,
            category: eventData.category,
            isTrending: eventData.isTrending,
            organizerId: eventData.organizerId,
            language: eventData.language,
            tags: eventData.tags,
            totalSlots: eventData.totalSlots,
            availableSlots: eventData.availableSlots,
            status: eventData.status,
          };

          setEvent(formattedEvent);
        } else {
          setError("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setError(error.message || "Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  useEffect(() => {
  const fetchQueuePosition = async () => {
    if (event && event.availableSlots === 0) {
      setLoadingPosition(true);
      try {
        const response = await fetch(`http://localhost:9192/api/events/position/${event.id}`);
        const data = await response.json();
        setQueuePosition(data.position);
      } catch (error) {
        console.error("Error fetching queue position:", error);
      } finally {
        setLoadingPosition(false);
      }
    }
  };

  fetchQueuePosition();
}, [event]);

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {error || "Event Not Found"}
        </h2>
        <p className="text-gray-600 mb-6">
          {error
            ? "There was an error loading the event. Please try again."
            : "The event you're looking for doesn't exist or has been removed."}
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-[#008CFF] text-white rounded-lg opacity-90 hover:opacity-100 transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (timeStr) => {
    if (!timeStr) return "Time TBA";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isEventFull = event.availableSlots === 0;
  const slotsPercentage = event.totalSlots
    ? ((event.totalSlots - event.availableSlots) / event.totalSlots) * 100
    : 0;

  return (
    <div className="px-6 md:px-12 py-8">
      {/* Title with badges */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <h1 className="text-2xl font-bold">{event.name}</h1>
        {event.isTrending && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            🔥 TRENDING
          </span>
        )}
        <span
          className={`text-xs font-bold px-2 py-1 rounded-md ${
            event.status === "UPCOMING"
              ? "bg-green-100 text-green-800"
              : event.status === "ONGOING"
              ? "bg-blue-100 text-[#008CFF]"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {event.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Content */}
        <div className="lg:col-span-2">
          {/* Cover Image */}
          <img
            src={event.image}
            alt={event.name}
            className="rounded-xl shadow-md w-full h-96 object-cover mb-6"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjQwMCIgeT0iMjAwIiBzdHlsZT0iZmlsbDojOTk5O2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjMwcHg7Zm9udC1mYW1pbHk6QXJpYWwsc2Fucy1zZXJpZiI+RXZlbnQgSW1hZ2U8L3RleHQ+PC9zdmc+";
            }}
          />

          {/* Tags */}
          {event.tags && (
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-blue-100 text-[#008CFF] text-sm font-medium px-3 py-1 rounded-full capitalize">
                {event.category}
              </span>
              {event.tags
                .split(",")
                .filter((tag) => tag.trim())
                .map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    {tag.trim()}
                  </span>
                ))}
            </div>
          )}

          {/* About Section */}
          <h2 className="text-xl font-semibold mb-3">About The Event</h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Info Card (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-10 bg-white shadow-2xl rounded-2xl border-[#008CFF] p-5 border-2 space-y-3">
            <div className="flex items-center space-x-3">
              <CalendarDays className="text-[#008CFF] w-5 h-5" />
              <p className="font-medium text-black">
                Date: {formatDate(event.date)}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <MdTimelapse className="text-[#008CFF] w-5 h-5" />
              <p className="font-medium text-black">
                Time: {formatTime(event.startTime)}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <GiDuration className="text-[#008CFF] w-5 h-5" />
              <p className="font-medium text-black">
                Duration: {event.duration}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <HiOutlineLocationMarker className="text-[#008CFF] w-5 h-5" />
              <p className="font-medium text-black">Venue: {event.venue}</p>
            </div>

            {event.city && (
              <div className="flex items-center space-x-3">
                <FaCity className="text-[#008CFF] w-5 h-5" />
                <p className="font-medium text-black">City: {event.city}</p>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <IoTicket className="text-[#008CFF] w-5 h-5" />
              <p className="font-medium text-black">Price: ₹{event.price}/-</p>
            </div>

            {event.language && (
              <div className="flex items-center space-x-3">
                <FaLanguage className="text-[#008CFF] w-5 h-5" />
                <p className="font-medium text-black">
                  Language: {event.language}
                </p>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <RiParentLine className="text-[#008CFF] w-5 h-5" />
              <p className="font-medium text-black">
                Age Limit: {event.ageLimit}+
              </p>
            </div>

            {/* Availability Status */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Availability
                </span>
                <span className="text-sm font-bold text-[#008CFF]">
                  {event.availableSlots}/{event.totalSlots} slots
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    slotsPercentage > 80
                      ? "bg-red-500"
                      : slotsPercentage > 60
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${slotsPercentage}%` }}
                />
              </div>
              {event.availableSlots < 10 && event.availableSlots > 0 && (
                <p className="text-xs text-red-600 mt-1 font-medium">
                  Hurry! Only {event.availableSlots} slots left
                </p>
              )}
            </div>

            {/* Queue Position - Only shown when slots are 0 */}
{event.availableSlots === 0 && (
  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
    <div className="flex items-center space-x-2">
      {/* <MdOutlineQueue className="text-orange-500 w-5 h-5" />
      <span className="text-sm font-medium text-orange-700">
        Waitlist
      </span> */}
    </div>
    {loadingPosition ? (
      <p className="text-sm text-gray-500 mt-2">Loading position...</p>
    ) : queuePosition !== null ? (
      <div className="mt-0">
        {queuePosition === 0 ? (

          <div className="flex items-center space-x-2">
  <ListEnd className="text-orange-500 w-5 h-5" />
  <div className="flex flex-col leading-tight">
  <p>
    <span className="text-sm font-medium text-orange-700">
      Waitlist Queue position:
      <span className="font-bold text-green-700"> 🎉 You will be first in the queue. Join the waitlist fast!!!</span>
    </span>
    </p>
  </div>
</div>

        ) : (
    <div className="flex items-center space-x-2">
  <ListEnd className="text-orange-500 w-5 h-5" />
  <div className="flex flex-col leading-tight">
    <p>
    <span className="text-sm font-medium text-orange-700">
      Waitlist Queue position:
      <span className="font-bold"> #{queuePosition} people ahead of you</span>
    </span>
    </p>
  </div>
</div>
        )}
      </div>
    ) : null}
  </div>
)}

            

            {/* <button 
              className={`w-full mt-3 font-semibold py-2 rounded-lg transition ${
                isEventFull 
                  ? 'bg-gray-700 text-white cursor-not-allowed'
                  : 'bg-[#008CFF] text-white hover:bg-blue-900'
              }`}
              disabled={isEventFull}
              onClick={() => {
                if (!isEventFull) {
                  console.log("Booking event:", event.id);
                  // Add booking logic here
                }
              }}
            >
              {isEventFull ? "Event Full" : "Book Now"}
            </button> */}
            <button
              className={`w-full mt-3 font-semibold py-2 rounded-lg transition ${
                isEventFull
                  ? "bg-yellow-600 text-white hover:bg-yellow-800"
                  : "bg-[#008CFF] text-white hover:bg-blue-900"
              }`}
              onClick={() => {
                navigate(`/book-event/${event.id}`, {
                  state: {
                    eventDetails: event,
                    isWaitingList: isEventFull,
                  }
                });
              }}
            >
              {isEventFull ? "Join Waiting Queue" : "Book Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { CalendarDays } from 'lucide-react';
// import { HiOutlineLocationMarker } from "react-icons/hi";
// import { RiParentLine } from "react-icons/ri";
// import { GiDuration } from "react-icons/gi";
// import { MdTimelapse } from "react-icons/md";
// import { IoTicket } from "react-icons/io5";
// import EventsService from "../services/eventsService";
// import LoadingSpinner from "./LoadingSpinner";

// const EventDetailsPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // useEffect(() => {
//   //   const fetchEvent = async () => {
//   //     try {
//   //       setLoading(true);
//   //       const eventData = await EventsService.getEventById(id);

//   //       if (eventData) {
//   //         // Add additional details that might not be in the service
//   //         const enrichedEvent = {
//   //           ...eventData,
//   //           price: eventData.price || "2500",
//   //           duration: eventData.duration || "2 Hours",
//   //           time: eventData.time || "7:00 PM Onwards",
//   //           agelimit: eventData.agelimit || "All Ages",
//   //           about: eventData.about || `Join us for ${eventData.name}! This will be an amazing experience at ${eventData.venue}. Don't miss out on this incredible event happening on ${eventData.date}.`
//   //         };
//   //         setEvent(enrichedEvent);
//   //       } else {
//   //         // Event not found
//   //         setEvent(null);
//   //       }
//   //     } catch (error) {
//   //       console.error("Error fetching event:", error);
//   //       setEvent(null);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchEvent();
//   // }, [id]);

//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         console.log("Fetching event with ID:", id);
//         const eventData = await EventsService.getEventById(id);
//         console.log("Fetched event data:", eventData);

//         if (eventData) {
//           // Format the event data to handle both backend and local formats
//           const formattedEvent = {
//             id: eventData.id,
//             name: eventData.name,
//             venue: eventData.venue,
//             // Handle date format from backend
//             date: eventData.eventDate || eventData.date || "TBA",
//             // Handle image URL
//             image: eventData.imageUrl || eventData.image,
//             // Handle price
//             price: eventData.price || "2500",
//             // Handle duration
//             duration: eventData.duration || "2 Hours",
//             // Handle time
//             time: eventData.time || eventData.eventTime || "7:00 PM Onwards",
//             // Handle age limit - backend might send as number
//             agelimit: eventData.ageLimit
//               ? (typeof eventData.ageLimit === 'number'
//                   ? `${eventData.ageLimit}+`
//                   : eventData.ageLimit)
//               : eventData.agelimit || "All Ages",
//             // Handle about/description
//             about: eventData.about || eventData.description ||
//               `Join us for ${eventData.name}! This will be an amazing experience at ${eventData.venue}. Don't miss out on this incredible event.`,
//             // Keep other backend fields if needed
//             category: eventData.category,
//             isTrending: eventData.isTrending,
//             organizerId: eventData.organizerId,
//             maxAttendees: eventData.maxAttendees,
//             currentAttendees: eventData.currentAttendees
//           };

//           setEvent(formattedEvent);
//         } else {
//           setError("Event not found");
//         }
//       } catch (error) {
//         console.error("Error fetching event:", error);
//         setError(error.message || "Failed to fetch event details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchEvent();
//     }
//   }, [id]);

//   if (loading) {
//     return <LoadingSpinner fullPage />;
//   }

//   // if (!event) {
//   //   return (
//   //     <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
//   //       <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
//   //       <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
//   //       <button
//   //         onClick={() => navigate('/')}
//   //         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-[#008CFF] transition"
//   //       >
//   //         Back to Home
//   //       </button>
//   //     </div>
//   //   );
//   // }

//   if (error || !event) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">
//           {error || "Event Not Found"}
//         </h2>
//         <p className="text-gray-600 mb-6">
//           {error
//             ? "There was an error loading the event. Please try again."
//             : "The event you're looking for doesn't exist or has been removed."}
//         </p>
//         <button
//           onClick={() => navigate('/')}
//           className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-[#008CFF] transition"
//         >
//           Back to Home
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="px-6 md:px-12 py-8">
//       {/* Title */}
//       <h1 className="text-2xl font-bold mb-6">{event.name}</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left Content */}
//         <div className="lg:col-span-2">
//           {/* Cover Image */}
//           <img
//             src={event.image}
//             alt={event.name}
//             className="rounded-xl shadow-md w-full h-96 object-cover mb-9"
//             onError={(e) => {
//               e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjIwMCIgeT0iMTUwIiBzdHlsZT0iZmlsbDojOTk5O2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjIwcHg7Zm9udC1mYW1pbHk6QXJpYWwsc2Fucy1zZXJpZiI+RXZlbnQgSW1hZ2U8L3RleHQ+PC9zdmc+';
//             }}
//           />

//           {/* About Section */}
//           <h2 className="text-xl font-semibold mb-2">About The Event</h2>
//           <p className="text-gray-700 whitespace-pre-line">{event.about}</p>
//         </div>

//         {/* Info Card (Sticky) */}
//         <div className="lg:col-span-1">
//           <div className="sticky top-10 bg-white shadow-lg rounded-xl p-5 border space-y-3">
//             <div className="flex items-center space-x-3">
//               <CalendarDays className="text-blue-600 w-5 h-5" />
//               <p className="font-medium text-black">Date: {event.date}</p>
//             </div>

//             <div className="flex items-center space-x-3">
//               <IoTicket className="text-blue-600 w-5 h-5" />
//               <p className="font-medium text-black">Price: ₹ {event.price}/-</p>
//             </div>

//             <div className="flex items-center space-x-3">
//               <MdTimelapse className="text-blue-600 w-5 h-5" />
//               <p className="font-medium text-black">Time: {event.time}</p>
//             </div>

//             <div className="flex items-center space-x-3">
//               <HiOutlineLocationMarker className="text-blue-600 w-5 h-5" />
//               <p className="font-medium text-black">At: {event.venue}</p>
//             </div>

//             <div className="flex items-center space-x-3">
//               <GiDuration className="text-blue-600 w-5 h-5" />
//               <p className="font-medium text-black">Duration: {event.duration}</p>
//             </div>

//             <div className="flex items-center space-x-3">
//               <RiParentLine className="text-blue-600 w-5 h-5" />
//               <p className="font-medium text-black">Age Limit: {event.agelimit}</p>
//             </div>

//             <button className="w-full mt-3 bg-[#008CFF] text-white font-semibold py-2 rounded-lg hover:bg-blue-900">
//               Book Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventDetailsPage;

//   return (
//     <div className="px-6 md:px-12 py-8">
//       {/* Title */}
//       <h1 className="text-2xl font-bold mb-6">{event.name}</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left Content */}
//         <div className="lg:col-span-2">
//           {/* Cover Image */}
//           <img
//             src={event.image}
//             alt={event.name}
//             className="rounded-xl shadow-md w-full h-96 object-cover mb-9"
//             onError={(e) => {
//               e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjIwMCIgeT0iMTUwIiBzdHlsZT0iZmlsbDojOTk5O2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjIwcHg7Zm9udC1mYW1pbHk6QXJpYWwsc2Fucy1zZXJpZiI+RXZlbnQgSW1hZ2U8L3RleHQ+PC9zdmc+';
//             }}
//           />

//           {/* About Section */}
//           <h2 className="text-xl font-semibold mb-2">About The Event</h2>
//           <p className="text-gray-700 whitespace-pre-line">{event.about}</p>
//         </div>

//         {/* Info Card (Sticky) */}
//         <div className="lg:col-span-1">
//           <div className="sticky top-10 bg-white shadow-lg rounded-xl p-5 border space-y-3">
//             <div className="flex items-center space-x-3">
//               <CalendarDays className="text-blue-600 w-5 h-5" />
//               <p className="font-medium text-black">Date: {event.date}</p>
//             </div>

//             <div className="flex items-center space-x-3">
//               <IoTicket className="text-blue-600 w-5 h-5" />
//               <p className="font-medium text-black">Price: ₹ {event.price}/-</p>
//             </div>

//             <div className="flex items-center space-x-3">
//               <MdTimelapse className="text-blue-600 w-5 h-5" />
//               <p className="font-medium text-black">Time: {event.time}</p>
//             </div>

//             <div className="flex items-center space-x-3">
//               <HiOutlineLocationMarker className="text-blue-600 w-5 h-5" />
//               <p className="font-medium text-black">At: {event.venue}</p>
//             </div>

//             <div className="flex items-center space-x-3">
//               <GiDuration className="text-blue-600 w-5 h-5" />
//               <p className="font-medium text-black">Duration: {event.duration}</p>
//             </div>

//             <div className="flex items-center space-x-3">
//               <RiParentLine className="text-blue-600 w-5 h-5" />
//               <p className="font-medium text-black">Age Limit: {event.agelimit}</p>
//             </div>

//             <button className="w-full mt-3 bg-[#008CFF] text-white font-semibold py-2 rounded-lg hover:bg-blue-900">
//               Book Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
