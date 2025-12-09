import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHistory,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaTicketAlt,
  FaQrcode,
  FaSpinner,
} from "react-icons/fa";
import { ChevronRight } from 'lucide-react';
import { HiSparkles } from "react-icons/hi";
import axios from "axios";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [queuePositions, setQueuePositions] = useState({});

  // Map API status to display status and event status
  const mapStatus = (apiStatus) => {
    const statusMap = {
      CONFIRMED: { status: "upcoming", displayStatus: "Confirmed" },
      PENDING: { status: "upcoming", displayStatus: "Waitlist" },
      QUEUED: { status: "upcoming", displayStatus: "Waitlist" },
      CANCELLED: { status: "cancelled", displayStatus: "Cancelled" },
      // 'COMPLETED': { status: 'completed', displayStatus: 'Attended' },
      // 'FAILED': { status: 'cancelled', displayStatus: 'Failed' },
    };
    return (
      statusMap[apiStatus] || { status: "upcoming", displayStatus: "Waitlist" }
    );
  };

  // Map category to display format
  const formatCategory = (category) => {
    const categoryMap = {
      music: "Music Concert",
      standup: "Comedy Show",
      theatre: "Theatre",
      sports: "Sports",
      conference: "Conference",
      workshop: "Workshop",
      festival: "Festival",
    };
    return categoryMap[category?.toLowerCase()] || "Event";
  };

  // Format time from HH:MM:SS to 12-hour format
  const formatTime = (timeStr) => {
    if (!timeStr) return "TBA";
    try {
      const [hours, minutes] = timeStr.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  // Fetch booking history from API
  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const response = await axios.get(
        "http://localhost:9192/api/booking/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Transform API data to component format
      // const transformedData = response.data.map((booking) => {
      //   const { status, displayStatus } = mapStatus(booking.status);

      //   return {
      //     id: booking.bookingId,
      //     name: booking.eventName,
      //     status: status,
      //     displayStatus: displayStatus,
      //     price: `₹${booking.price}`,
      //     date: booking.eventDate,
      //     venue: `${booking.venue}${booking.city ? `, ${booking.city}` : ''}`,
      //     time: formatTime(booking.time),
      //     bookedDate: booking.bookedOn ? booking.bookedOn.split('T')[0] : new Date().toISOString().split('T')[0],
      //     category: formatCategory(booking.category),
      //     image: booking.photo || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
      //     // Add any waitlist position if status is PENDING
      //     ...(booking.status === 'PENDING' && { waitlistPosition: booking.waitlistPosition || 1 })
      //   };
      // });

      // Transform API data to component format
      // Transform API data to component format
      const transformedData = response.data.map((booking) => {
        const { status, displayStatus } = mapStatus(booking.status);

        return {
          id: booking.bookingId,
          eventId: booking.eventId,
          name: booking.eventName,
          status: status,
          orderId: booking.orderId,
          displayStatus: displayStatus,
          price: `₹${booking.price}`,
          date: booking.eventDate,
          venue: `${booking.venue}${booking.city ? `, ${booking.city}` : ""}`,
          time: formatTime(booking.time),
          bookedDate: booking.bookedOn
            ? booking.bookedOn.split("T")[0]
            : new Date().toISOString().split("T")[0],
          category: formatCategory(booking.category),
          image:
            booking.photo ||
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
          // Add queue position directly from API response
          ...(booking.queue_position !== undefined &&
            booking.queue_position !== null &&
            booking.queue_position >= 0 && {
              waitlistPosition: booking.queue_position,
            }),
        };
      });

      // Sort by booking date (most recent first)
      transformedData.sort(
        (a, b) => new Date(b.bookedDate) - new Date(a.bookedDate)
      );

      setHistory(transformedData);
    } catch (err) {
      console.error("Error fetching booking history:", err);
      setError(
        err.response?.data?.message || "Failed to fetch booking history"
      );

      // Set demo data if API fails (remove in production)
      if (err.response?.status === 401) {
        setError("Please login to view your booking history");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch queue position for a specific event
const fetchQueuePosition = async (orderId, eventId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `http://localhost:9192/api/events/${orderId}/queue/${eventId}/position`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.position;
  } catch (err) {
    console.error(`Error fetching queue position for event ${eventId}:`, err);
    return null;
  }
};

  // Fetch queue position for waitlist events
  // Fetch queue position for waitlist events
  // const fetchQueuePosition = async (eventId) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.get(`http://localhost:9192/api/events/position/${eventId}`, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     console.log(`Position for event ${eventId}:`, response.data); // ADD THIS
  //     // Return the position directly (including 0)
  //     return response.data.position;
  //   } catch (err) {
  //     console.error(`Error fetching queue position for event ${eventId}:`, err);
  //     return null;
  //   }
  // };

  useEffect(() => {
    fetchBookingHistory();

    // Optionally refresh data every 30 seconds for live updates
    // const interval = setInterval(fetchBookingHistory, 30000);
    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  const fetchAllQueuePositions = async () => {
    const waitlistEvents = history.filter(
      (event) => event.displayStatus === "Waitlist"
    );

    if (waitlistEvents.length === 0) return;

    const positions = {};
    for (const event of waitlistEvents) {
      const position = await fetchQueuePosition(event.orderId, event.eventId);
      if (position !== null) {
        positions[event.id] = position;
      }
    }
    setQueuePositions(positions);
  };

  if (history.length > 0) {
    fetchAllQueuePositions();
  }
}, [history]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-IN", options);
  };

  const getStatusConfig = (status, displayStatus) => {
    const configs = {
      Confirmed: {
        icon: <FaCheckCircle />,
        bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
        borderColor: "border-green-400",
        textColor: "text-green-700",
        badgeClasses:
          "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
      },
      Cancelled: {
        icon: <FaTimesCircle />,
        bgColor: "bg-gradient-to-r from-red-50 to-pink-50",
        borderColor: "border-red-300",
        textColor: "text-red-700",
        badgeClasses: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
      },
      Failed: {
        icon: <FaTimesCircle />,
        bgColor: "bg-gradient-to-r from-red-50 to-pink-50",
        borderColor: "border-red-300",
        textColor: "text-red-700",
        badgeClasses: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
      },
      Waitlist: {
        icon: <FaExclamationCircle />,
        bgColor: "bg-gradient-to-r from-amber-50 to-yellow-50",
        borderColor: "border-amber-400",
        textColor: "text-amber-700",
        badgeClasses:
          "bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
      },
      Pending: {
        icon: <FaExclamationCircle />,
        bgColor: "bg-gradient-to-r from-amber-50 to-yellow-50",
        borderColor: "border-amber-400",
        textColor: "text-amber-700",
        badgeClasses:
          "bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
      },
      Attended: {
        icon: <HiSparkles />,
        bgColor: "bg-gradient-to-r from-purple-50 to-indigo-50",
        borderColor: "border-purple-300",
        textColor: "text-purple-700",
        badgeClasses:
          "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
      },
    };
    return configs[displayStatus] || configs["Confirmed"];
  };

  const handleViewTicket = (event) => {
    navigate(`/view-ticket/${event.id}`);
    // navigate('/view-ticket', {
    //   state: {
    //     ticketData: {
    //       eventImage: event.image || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500',
    //       status: event.status,
    //       eventName: event.name || event.title,
    //       ticketPrice: event.price || 1500,
    //       eventTime: event.time || '18:00',
    //       eventDate: event.date,
    //       eventDuration: event.duration || '3 hours',
    //       eventVenue: event.venue || 'Phoenix Arena',
    //       eventCity: event.location || 'Mumbai',
    //       ageLimit: event.ageLimit || '18+',
    //       language: event.language || 'English',
    //       bookedDate: event.bookingDate || event.bookedDate,
    //       bookedTime: event.bookingTime || '14:30',
    //       orderId: event.id || 'ORD123456789',
    //       paymentId: event.paymentId || 'PAY987654321',
    //       qrCodeData: `TICKET-${event.id}-${Date.now()}`
    //     }
    //   }
    // });
  };

  // Retry function
  const handleRetry = () => {
    fetchBookingHistory();
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your booking history...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-transparent p-10 mt-5 md:px-60 md:mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16">
            <FaTimesCircle className="mx-auto text-5xl md:text-6xl text-red-400 mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">
              {error}
            </h3>
            <button
              onClick={handleRetry}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-10 mt-5 md:px-60 md:mt-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h2 className="flex items-center text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            <FaHistory className="mr-2 mt-1 md:mr-3 text-blue-600 text-xl md:text-2xl" />
            Your Booking History
          </h2>
          <p className="text-sm md:text-base text-gray-600 ml-8 md:ml-12">
            Manage and view all your event bookings
            {history.length > 0 && (
              <span className="ml-2 text-blue-600">
                ({history.length} bookings)
              </span>
            )}
          </p>
        </div>

        {/* Ticket Cards */}
        <div className="space-y-6 md:space-y-8 md:px-0">
          {history.map((event) => {
            const statusConfig = getStatusConfig(
              event.status,
              event.displayStatus
            );

            return (
              <div
                key={event.id}
                className={`relative group ${statusConfig.bgColor} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${statusConfig.borderColor}`}
              >
                {/* Desktop: Vertical dashed line | Mobile: Horizontal dashed line */}
                <div className="hidden md:block absolute ml-0.5 left-1/3 transform -translate-x-0.5 top-0 bottom-0 border-l-2 border-dashed border-gray-500 opacity-25"></div>
                <div className="md:hidden absolute left-0 right-0 top-[50%] transform -translate-y-1/2 border-t-2 border-dashed border-gray-500 opacity-25"></div>

                {/* Desktop: Decorative Circles on sides | Mobile: Decorative Circles on top/bottom */}
                {/* Desktop Circles */}
                <div
                  className={`hidden md:block absolute -top-4 left-1/3 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-full border-2 ${statusConfig.borderColor} border-x-white`}
                ></div>
                <div
                  className={`hidden md:block absolute -bottom-4 left-1/3 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 rounded-full border-2 ${statusConfig.borderColor} border-x-white`}
                ></div>

                {/* Mobile Circles */}
                <div
                  className={`md:hidden absolute -left-4 top-[50%] transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-full border-2 ${statusConfig.borderColor} border-y-white`}
                ></div>
                <div
                  className={`md:hidden absolute -right-4 top-[50%] transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 rounded-full border-2 ${statusConfig.borderColor} border-y-white`}
                ></div>

                <div className="flex flex-col md:flex-row">
                  {/* Left Section (Desktop) / Top Section (Mobile) - Event Image and Basic Info */}
                  <div className="w-full md:w-1/3 p-4 md:p-6 relative">
                    <div className="relative">
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-40 md:h-48 object-cover rounded-xl shadow-md"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop";
                        }}
                      />
                      {/* Status Badge Overlay */}
                      <div
                        className={`absolute top-2 md:top-3 right-2 md:right-3 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full ${statusConfig.badgeClasses} flex items-center gap-1 md:gap-1.5 text-xs md:text-sm font-bold shadow-lg`}
                      >
                        <span className="text-xs md:text-sm">
                          {statusConfig.icon}
                        </span>
                        {event.displayStatus}
                      </div>
                    </div>

                    <div className="mt-3 md:mt-4 text-center">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        {event.category}
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-gray-800 leading-tight">
                        {event.name}
                      </h3>
                    </div>
                  </div>

                  {/* Right Section (Desktop) / Bottom Section (Mobile) - Detailed Information */}
                  <div className="w-full md:w-2/3 p-4 md:p-6">
                    <div className="mb-4">
                      {/* Event Name at top - Hidden on mobile as it's shown above */}
                      <h3 className="hidden md:block text-2xl font-bold text-gray-800 mb-1">
                        {event.name}
                      </h3>
                      {/* Price */}
                      <div className="hidden md:block text-[16px] font-semibold text-blue-600 text-center md:text-left">
                        {event.price}
                      </div>
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
                      <div className="flex items-start gap-2">
                        <FaCalendarAlt className="text-blue-600 mt-0.5 md:mt-1 text-sm md:text-base" />
                        <div>
                          <div className="text-xs text-gray-500">
                            Event Date
                          </div>
                          <div className="text-sm md:text-base font-semibold text-gray-800">
                            {formatDate(event.date)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <FaClock className="text-blue-600 mt-0.5 md:mt-1 text-sm md:text-base" />
                        <div>
                          <div className="text-xs text-gray-500">Time</div>
                          <div className="text-sm md:text-base font-semibold text-gray-800">
                            {event.time}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 col-span-2 md:col-span-1">
                        <FaMapMarkerAlt className="text-blue-600 mt-0.5 md:mt-1 text-sm md:text-base" />
                        <div>
                          <div className="text-xs text-gray-500">Venue</div>
                          <div className="text-sm md:text-base font-semibold text-gray-800">
                            {event.venue}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 col-span-2 md:col-span-1">
                        <FaCalendarAlt className="text-blue-600 mt-0.5 md:mt-1 text-sm md:text-base" />
                        <div>
                          <div className="text-xs text-gray-500">Booked On</div>
                          <div className="text-sm md:text-base font-semibold text-gray-800">
                            {formatDate(event.bookedDate)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Status Info */}
                    {/* {(event.displayStatus === "Waitlist" || event.displayStatus === "Pending") && event.waitlistPosition && (
                      <div className="bg-amber-100 text-amber-800 px-3 py-2 rounded-lg text-xs md:text-sm mb-4">
                        <strong>Waitlist Position:</strong> #{event.waitlistPosition}
                      </div>
                    )} */}

                    {/* {(event.displayStatus === "Waitlist") && event.waitlistPosition !== undefined && event.waitlistPosition !== null && ( */}
                    {/* {event.displayStatus === "Waitlist" &&
                      event.waitlistPosition !== undefined &&
                      event.waitlistPosition !== null &&
                      event.waitlistPosition >= 0 && (
                        <div className="bg-amber-100 text-amber-800 px-3 py-2 rounded-lg text-xs md:text-sm mb-4">
                          <strong>Queue Position:</strong>{" "}
                          {event.waitlistPosition === 0
                            ? "Next in line!"
                            : `#${event.waitlistPosition}`}
                        </div>
                      )} */}

                      {event.displayStatus === "Waitlist" && (
  queuePositions[event.id] !== undefined ? (
    <div className="bg-amber-100 text-amber-800 px-3 py-2 rounded-lg text-xs md:text-sm mb-4">
      <strong>Queue Position:</strong>{" "}
      {queuePositions[event.id] === 0
        ? "Next in line! 🎉"
        : `#${queuePositions[event.id]} in queue`}
    </div>
  ) : (
    <div className="bg-amber-50 text-amber-600 px-3 py-2 rounded-lg text-xs md:text-sm mb-4">
      <FaSpinner className="inline animate-spin mr-2" />
      Loading queue position...
    </div>
  )
)}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200 gap-3">
                      <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                        {/* <button
                          onClick={() => handleViewTicket(event)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 md:gap-2 bg-white text-blue-600 border-2 border-blue-600 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-blue-50 transition"
                        >
                          View Ticket →
                        </button> */}
                        <Link
                           to={`/view-ticket/${event.id}`}
                           className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 md:gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md"
                         >
                           <FaQrcode />
                           View Ticket
                         </Link>

                        {/* Only show Event Details for upcoming events */}
                        {event.status === "upcoming" && (
                          <Link
                            to={`/event/${event.eventId}`}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-0.5 md:gap-1 bg-white text-blue-600 border-2 border-blue-600 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-blue-50 transition"
                          >
                            Event Details
                            <ChevronRight className="h-3 w-3 mt-0.5"/>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {!loading && history.length === 0 && (
          <div className="text-center py-16">
            <FaTicketAlt className="mx-auto text-5xl md:text-6xl text-gray-300 mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">
              No bookings yet
            </h3>
            <p className="text-sm md:text-base text-gray-500">
              Your booking history will appear here
            </p>
            <Link
              to="/events"
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition"
            >
              Browse Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FaHistory,
//   FaCalendarAlt,
//   FaClock,
//   FaMapMarkerAlt,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaExclamationCircle,
//   FaTicketAlt,
//   FaQrcode
// } from "react-icons/fa";
// import { HiSparkles } from "react-icons/hi";

// const History = () => {
//   const [history, setHistory] = useState([
//     {
//       id: 1,
//       name: "Arijit Singh Live Concert",
//       status: "upcoming",
//       displayStatus: "Confirmed",
//       price: "₹1200",
//       date: "2025-10-15",
//       venue: "NSCI Dome, Mumbai",
//       time: "7:00 PM",
//       bookedDate: "2025-09-28",
//       category: "Music Concert",
//       image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop"
//     },
//     {
//       id: 2,
//       name: "Standup Comedy Night - Zakir Khan",
//       status: "cancelled",
//       displayStatus: "Cancelled",
//       price: "₹499",
//       date: "2025-10-10",
//       venue: "Habitat Comedy Club, Delhi",
//       time: "8:00 PM",
//       bookedDate: "2025-09-25",
//       category: "Comedy Show",
//       image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=500&h=300&fit=crop"
//     },
//     {
//       id: 3,
//       name: "EDM Night with DJ Snake",
//       status: "upcoming",
//       displayStatus: "Waitlist",
//       price: "₹2499",
//       date: "2025-10-20",
//       venue: "DY Patil Stadium, Mumbai",
//       time: "9:00 PM",
//       bookedDate: "2025-09-30",
//       category: "Music Festival",
//       image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop",
//       waitlistPosition: 12
//     },
//     {
//       id: 4,
//       name: "Mumbai Theatre Festival 2024",
//       status: "completed",
//       displayStatus: "Attended",
//       price: "₹799",
//       date: "2024-08-15",
//       venue: "Prithvi Theatre, Mumbai",
//       time: "6:30 PM",
//       bookedDate: "2024-08-01",
//       category: "Theatre",
//       image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop"
//     }
//   ]);

//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
//     return date.toLocaleDateString('en-IN', options);
//   };

//   const getStatusConfig = (status, displayStatus) => {
//     const configs = {
//       "Confirmed": {
//         icon: <FaCheckCircle />,
//         bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
//         borderColor: "border-green-400",
//         textColor: "text-green-700",
//         badgeClasses: "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
//       },
//       "Cancelled": {
//         icon: <FaTimesCircle />,
//         bgColor: "bg-gradient-to-r from-red-50 to-pink-50",
//         borderColor: "border-red-300",
//         textColor: "text-red-700",
//         badgeClasses: "bg-gradient-to-r from-red-500 to-pink-500 text-white"
//       },
//       "Waitlist": {
//         icon: <FaExclamationCircle />,
//         bgColor: "bg-gradient-to-r from-amber-50 to-yellow-50",
//         borderColor: "border-amber-400",
//         textColor: "text-amber-700",
//         badgeClasses: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
//       },
//       "Attended": {
//         icon: <HiSparkles />,
//         bgColor: "bg-gradient-to-r from-purple-50 to-indigo-50",
//         borderColor: "border-purple-300",
//         textColor: "text-purple-700",
//         badgeClasses: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
//       }
//     };
//     return configs[displayStatus] || configs["Confirmed"];
//   };

//   useEffect(() => {
//     // Later: Fetch from backend
//   }, []);

//   const navigate = useNavigate();

//   const handleViewTicket = (event) => {
//   navigate('/view-ticket', {
//     state: {
//       ticketData: {
//         eventImage: event.image || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500',
//         status: event.status,
//         eventName: event.name || event.title,
//         ticketPrice: event.price || 1500,
//         eventTime: event.time || '18:00',
//         eventDate: event.date,
//         eventDuration: event.duration || '3 hours',
//         eventVenue: event.venue || 'Phoenix Arena',
//         eventCity: event.location || 'Mumbai',
//         ageLimit: event.ageLimit || '18+',
//         language: event.language || 'English',
//         bookedDate: event.bookingDate || '2024-01-20',
//         bookedTime: event.bookingTime || '14:30',
//         orderId: event.orderId || 'ORD123456789',
//         paymentId: event.paymentId || 'PAY987654321',
//         qrCodeData: `TICKET-${event.id}-${Date.now()}`
//       }
//     }
//   });
// };

//   return (
//     <div className="min-h-screen bg-transparent p-10 mt-5 md:px-60 md:mt-10">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-6 md:mb-8">
//           <h2 className="flex items-center text-2xl md:text-3xl font-bold text-gray-800 mb-2">
//             <FaHistory className="mr-2 mt-1 md:mr-3 text-blue-600 text-xl md:text-2xl" />
//             Your Booking History
//           </h2>
//           <p className="text-sm md:text-base text-gray-600 ml-8 md:ml-12">Manage and view all your event bookings</p>
//         </div>

//         {/* Ticket Cards */}
//         <div className="space-y-6 md:space-y-8 md:px-0">
//           {history.map((event) => {
//             const statusConfig = getStatusConfig(event.status, event.displayStatus);

//             return (
//               <div
//                 key={event.id}
//                 className={`relative group ${statusConfig.bgColor} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${statusConfig.borderColor}`}
//               >

//                 {/* Desktop: Vertical dashed line | Mobile: Horizontal dashed line */}
//                 <div className="hidden md:block absolute ml-0.5 left-1/3 transform -translate-x-0.5 top-0 bottom-0 border-l-2 border-dashed border-gray-500 opacity-25"></div>
//                 <div className="md:hidden absolute left-0 right-0 top-[50%] transform -translate-y-1/2 border-t-2 border-dashed border-gray-500 opacity-25"></div>

//                 {/* Desktop: Decorative Circles on sides | Mobile: Decorative Circles on top/bottom */}
//                 {/* Desktop Circles */}
//                 <div className={`hidden md:block absolute -top-4 left-1/3 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-full border-2 ${statusConfig.borderColor} border-x-white`}></div>
//                 <div className={`hidden md:block absolute -bottom-4 left-1/3 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 rounded-full border-2 ${statusConfig.borderColor} border-x-white`}></div>

//                 {/* Mobile Circles */}
//                 <div className={`md:hidden absolute -left-4 top-[50%] transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-full border-2 ${statusConfig.borderColor} border-y-white`}></div>
//                 <div className={`md:hidden absolute -right-4 top-[50%] transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 rounded-full border-2 ${statusConfig.borderColor} border-y-white`}></div>

//                 <div className="flex flex-col md:flex-row">
//                   {/* Left Section (Desktop) / Top Section (Mobile) - Event Image and Basic Info */}
//                   <div className="w-full md:w-1/3 p-4 md:p-6 relative">
//                     <div className="relative">
//                       <img
//                         src={event.image}
//                         alt={event.name}
//                         className="w-full h-40 md:h-48 object-cover rounded-xl shadow-md"
//                       />
//                       {/* Status Badge Overlay */}
//                       <div className={`absolute top-2 md:top-3 right-2 md:right-3 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full ${statusConfig.badgeClasses} flex items-center gap-1 md:gap-1.5 text-xs md:text-sm font-bold shadow-lg`}>
//                         <span className="text-xs md:text-sm">{statusConfig.icon}</span>
//                         {event.displayStatus}
//                       </div>
//                     </div>

//                     <div className="mt-3 md:mt-4 text-center">
//                       <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
//                         {event.category}
//                       </div>
//                       <h3 className="text-base  md:text-lg font-bold text-gray-800 leading-tight">
//                         {event.name}
//                       </h3>
//                     </div>
//                   </div>

//                   {/* Right Section (Desktop) / Bottom Section (Mobile) - Detailed Information */}
//                   <div className="w-full md:w-2/3 p-4 md:p-6">
//                     <div className="mb-4">
//                       {/* Event Name at top - Hidden on mobile as it's shown above */}
//                       <h3 className="hidden md:block text-2xl font-bold text-gray-800 mb-1">
//                         {event.name}
//                       </h3>
//                       {/* Price */}
//                       <div className="hidden md:block text-[16px] font-semibold text-blue-600 text-center md:text-left">
//                         {event.price}
//                       </div>
//                     </div>

//                     {/* Event Details Grid */}
//                     <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
//                       <div className="flex items-start gap-2">
//                         <FaCalendarAlt className="text-blue-600 mt-0.5 md:mt-1 text-sm md:text-base" />
//                         <div>
//                           <div className="text-xs text-gray-500">Event Date</div>
//                           <div className="text-sm md:text-base font-semibold text-gray-800">{formatDate(event.date)}</div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-2">
//                         <FaClock className="text-blue-600 mt-0.5 md:mt-1 text-sm md:text-base" />
//                         <div>
//                           <div className="text-xs text-gray-500">Time</div>
//                           <div className="text-sm md:text-base font-semibold text-gray-800">{event.time}</div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-2 col-span-2 md:col-span-1">
//                         <FaMapMarkerAlt className="text-blue-600 mt-0.5 md:mt-1 text-sm md:text-base" />
//                         <div>
//                           <div className="text-xs text-gray-500">Venue</div>
//                           <div className="text-sm md:text-base font-semibold text-gray-800">{event.venue}</div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-2 col-span-2 md:col-span-1">
//                         <FaCalendarAlt className="text-blue-600 mt-0.5 md:mt-1 text-sm md:text-base" />
//                         <div>
//                           <div className="text-xs text-gray-500">Booked On</div>
//                           <div className="text-sm md:text-base font-semibold text-gray-800">{formatDate(event.bookedDate)}</div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Additional Status Info */}
//                     {event.displayStatus === "Waitlist" && event.waitlistPosition && (
//                       <div className="bg-amber-100 text-amber-800 px-3 py-2 rounded-lg text-xs md:text-sm mb-4">
//                         <strong>Waitlist Position:</strong> #{event.waitlistPosition}
//                       </div>
//                     )}

//                     {/* Action Buttons */}
//                     <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200 gap-3">
//                       <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
//                         {/* <Link
//                           to={`/booking/${event.id}`}
//                           className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 md:gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md"
//                         >
//                           <FaQrcode />
//                           View Ticket
//                         </Link> */}

//                         <button
//     onClick={() => handleViewTicket(event)}
//     className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 md:gap-2 bg-white text-blue-600 border-2 border-blue-600 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-blue-50 transition"
//   >
//     View Ticket →
//   </button>

//                         {/* Only show Event Details for upcoming events */}
//                         {event.status === "upcoming" && (
//                           <Link
//                             to={`/event/${event.id}`}
//                             className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 md:gap-2 bg-white text-blue-600 border-2 border-blue-600 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-blue-50 transition"
//                           >
//                             Event Details →
//                           </Link>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Empty State (if needed) */}
//         {history.length === 0 && (
//           <div className="text-center py-16">
//             <FaTicketAlt className="mx-auto text-5xl md:text-6xl text-gray-300 mb-4" />
//             <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">No bookings yet</h3>
//             <p className="text-sm md:text-base text-gray-500">Your booking history will appear here</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default History;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { FaHistory } from "react-icons/fa";

// const History = () => {
//   const [history, setHistory] = useState([
//     {
//       id: 1,
//       name: "Arijit Singh Live Concert",
//       status: "Confirmed",
//       price: "₹1200",
//       date: "2025-10-15",
//       venue: "NSCI Dome, Mumbai",
//       time: "7:00 PM",
//       bookedDate: "2025-09-28",
//     },
//     {
//       id: 2,
//       name: "Standup Comedy Night",
//       status: "Cancelled",
//       price: "₹499",
//       date: "2025-10-10",
//       venue: "Habitat, Delhi",
//       time: "8:00 PM",
//       bookedDate: "2025-09-25",
//     },

//     {
//       id: 2,
//       name: "Standup Comedy Night",
//       status: "Waitlist",
//       price: "₹499",
//       date: "2025-10-10",
//       venue: "Habitat, Delhi",
//       time: "8:00 PM",
//       bookedDate: "2025-09-25",
//     },
//   ]);

//   useEffect(() => {
//     // Later: Fetch from backend
//   }, []);

//   return (
//     <div className="p-6 mt-15 flex justify-center">
//       <div className="w-full max-w-4xl">
//         <h2 className="flex items-center text-3xl font-bold mb-7"> <FaHistory className="mr-2 h-7 w-7 align-middle mt-1" />Booking History</h2>

//         <div className="space-y-7">
//           {history.map((event) => (
//             <div
//               key={event.id}
//               className="p-7 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
//             >
//               {/* Top Row: Event Name + Status */}
//               <div className="flex justify-between items-center pb-2 mb-3">

//                 <h3 className="text-xl font-bold">{event.name}</h3>
//                 <span
//                   className={` px-3 py-1 p-2 rounded-full text-sm font-medium ${
//                     event.status === "Confirmed"
//                       ? "bg-green-100 text-green-700"
//                       : event.status === "Cancelled"
//                       ? "bg-red-100 text-red-700"
//                       : "bg-yellow-100 text-yellow-700"
//                   }`}
//                 >
//                   {event.status}
//                 </span>
//               </div>
//               <hr className="mt-3 mb-5.5 border-black" />

//               {/* Details */}
//               <div className="text-black space-y-1 text-sm">
//                 <p>
//                   <strong>Price:</strong> {event.price}
//                 </p>
//                 <p>
//                   <strong>Date:</strong> {event.date}
//                 </p>
//                 <p>
//                   <strong>Venue:</strong> {event.venue}
//                 </p>
//                 <p>
//                   <strong>Time:</strong> {event.time}
//                 </p>
//                 <p>
//                   <strong>Booked Date:</strong> {event.bookedDate}
//                 </p>
//               </div>

//               {/* More Details Link */}

//               <div className="flex justify-between items-center mt-5">
//                 <div className="text-left">
//                 <Link
//                   to={`/event/${event.id}`}
//                   className="text-white bg-[#008CFF] rounded-full text-sm font-medium flex justify-between items-center py-1 px-3 opacity-90 hover:opacity-100 transition"
//                 >
//                 Booking Details
//                 </Link>
//                 </div>
//                 <div className="text-right">
//                 <Link
//                   to={`/event/${event.id}`}
//                   className="text-[#008CFF] hover:underline text-sm font-medium"
//                 >
//                 Event Details →
//                 </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default History;
