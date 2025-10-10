import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  ChevronLeft
} from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";

const EventHistory = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not an organizer
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      toast.error("Please login to view event history");
    } else if (user?.accountType !== "ORGANIZER" && user?.role !== "ORGANIZER") {
      navigate("/");
      toast.error("Only organizers can view event history");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch event history
  useEffect(() => {
    fetchEventHistory();
  }, []);

  const fetchEventHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:9192/api/events/organizer/history", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        // Fallback to dummy data for testing
        setEvents(getDummyEvents());
      }
    } catch (error) {
      console.error("Error fetching event history:", error);
      // Use dummy data if API fails
      setEvents(getDummyEvents());
    } finally {
      setLoading(false);
    }
  };

  // Dummy data for testing
  const getDummyEvents = () => [
    {
      id: 1,
      name: "Rock Concert 2024",
      status: "completed",
      date: "2024-01-15",
      price: 1500,
      venue: "Mumbai Stadium",
      duration: 3,
      totalSlots: 500
    },
    {
      id: 2,
      name: "Tech Conference",
      status: "upcoming",
      date: "2024-12-25",
      price: 2500,
      venue: "Delhi Convention Center",
      duration: 8,
      totalSlots: 200
    },
    {
      id: 3,
      name: "Comedy Night",
      status: "cancelled",
      date: "2024-02-20",
      price: 800,
      venue: "Bangalore Comedy Club",
      duration: 2,
      totalSlots: 150
    },
    {
      id: 4,
      name: "Food Festival",
      status: "upcoming",
      date: "2024-12-30",
      price: 500,
      venue: "Hyderabad Grounds",
      duration: 6,
      totalSlots: 1000
    },
    {
      id: 5,
      name: "Art Exhibition",
      status: "COMPLETED",
      date: "2024-01-10",
      price: 300,
      venue: "Chennai Art Gallery",
      duration: 4,
      totalSlots: 100
    }
  ];

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'upcoming':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
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
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Event History</h1>
          <p className="text-gray-600 mt-2">View all your past and current events</p>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No events found in your history</p>
            <button
              onClick={() => navigate('/create-event')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div 
                key={event.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                {/* Event Header - Name and Status */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {event.name}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                    {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
                  </span>
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  {/* Date */}
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-medium">{formatDate(event.date)}</p>
                    </div>
                  </div>

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
                      <p className="font-medium">{event.venue}</p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-medium">{event.duration} hours</p>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventHistory;