import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Globe,
  User,
  Ticket,
  ArrowLeft,
  CreditCard,
  AlertCircle,
  Building2,
} from "lucide-react";
import EventsService from "../services/eventsService";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";
import handlePayment from "../utils/handlePayment";

const BookEvent = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    loading: authLoading,
    isInitialized,
  } = useAuth();

  const [event, setEvent] = useState(location.state?.eventDetails || null);
  const [loading, setLoading] = useState(!location.state?.eventDetails);
  const [isWaitingList, setIsWaitingList] = useState(
    location.state?.isWaitingList || false
  );
  const [userDetails, setUserDetails] = useState(null);
  const [userAge, setUserAge] = useState(null);
  const [isAgeEligible, setIsAgeEligible] = useState(true);
  const [fetchingUserDetails, setFetchingUserDetails] = useState(false);

  const fetchUserDetails = async () => {
    try {
      setFetchingUserDetails(true);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:9192/api/user/account", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);

        // Calculate age from DOB
        if (data.dob || data.dateOfBirth) {
          const dob = new Date(data.dob || data.dateOfBirth);
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < dob.getDate())
          ) {
            age--;
          }
          setUserAge(age);
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.warning("Could not verify age. Please update your profile.");
    } finally {
      setFetchingUserDetails(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isInitialized) {
      if (!isAuthenticated) {
        toast.error("Please login to book events");
        navigate("/signin");
        return;
      }

      // Calculate user age if DOB is available
      //   if (user?.dob || user?.dateOfBirth) {
      //     const dob = new Date(user.dob || user.dateOfBirth);
      //     const today = new Date();
      //     let age = today.getFullYear() - dob.getFullYear();
      //     const monthDiff = today.getMonth() - dob.getMonth();
      //     if (
      //       monthDiff < 0 ||
      //       (monthDiff === 0 && today.getDate() < dob.getDate())
      //     ) {
      //       age--;
      //     }
      //     setUserAge(age);
      //   }

      // Fetch user details from backend
      fetchUserDetails();
      if (!event) {
        fetchEventDetails();
      }
    }
  }, [id, event, isAuthenticated, authLoading, isInitialized]);

  // Check age eligibility when event and userAge are available
  useEffect(() => {
    if (event && userAge !== null) {
      const ageLimit = parseInt(event.ageLimit) || 0;
      setIsAgeEligible(userAge >= ageLimit);
    }
  }, [event, userAge]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const eventData = await EventsService.getEventById(id);

      if (eventData) {
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
          category: eventData.category,
          language: eventData.language,
          totalSlots: eventData.totalSlots,
          availableSlots: eventData.availableSlots,
        };

        setEvent(formattedEvent);
        setIsWaitingList(formattedEvent.availableSlots === 0);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Failed to load event details");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "TBA";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "TBA";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleProceedToPayment = () => {
    // Check age eligibility
    if (!isAgeEligible) {
      toast.error(
        `This event is for people who are ${event.ageLimit}+ years old. Currently you can't book this event.`
      );
      return;
    }

    // console.log(event);

    handlePayment(
      event.price, 
      userDetails.name, 
      userDetails.email, 
      userDetails.phoneNumber, 
      event.id,
      event.name, 
      event.description
    );

    // Navigate to payment page with event details
    // navigate(`/payment/${event.id}`, {
    //   state: {
    //     eventDetails: event,
    //     isWaitingList: isWaitingList,
    //     userId: user?.id,
    //   },
    // });
  };

  // Show loading while auth is initializing
  if (authLoading || !isInitialized || fetchingUserDetails) {
    return <LoadingSpinner fullPage />;
  }

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Event not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-[#008CFF] hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Event Details
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Book Your Ticket
        </h1>

        {/* Ticket Card */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Ticket Decoration - Top circles */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full"></div>

          {/* Ticket Main Content */}
          <div className="relative">
            {/* Event Image Section */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-r from-[#008CFF] to-purple-600">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover opacity-90"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {event.name}
                </h2>
                <div className="flex items-center text-white/90 text-sm">
                  <Ticket className="w-4 h-4 mr-1" />
                  <span>E-Ticket</span>
                </div>
              </div>
            </div>

            {/* Dotted Line Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center px-0">
                {/* <div className="w-full border-t-5 border-dashed border-black"></div>*/}
                <div className="w-full border-t-7 border-dotted border-white"></div> 
              </div>
              <div className="relative flex justify-between px-2">
                {/* <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full"></div> */}
              </div>
            </div>

            {/* Ticket Details */}
            <div className="p-6 space-y-4">
              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatTime(event.startTime)}
                    </p>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Venue</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {event.venue}
                    </p>
                  </div>
                </div>

                {/* City */}
                <div className="flex items-start space-x-3">
                  <Building2 className="w-5 h-5 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">City</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {event.city || "TBA"}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {event.duration}
                    </p>
                  </div>
                </div>

                {/* Language */}
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Language</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {event.language || "Multiple"}
                    </p>
                  </div>
                </div>

                {/* Age Limit */}
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Age Limit</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {event.ageLimit}+
                    </p>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Availability</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {event.availableSlots > 0
                        ? `${event.availableSlots} / ${event.totalSlots} slots`
                        : "Fully Booked"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Section - Full Width */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Ticket Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{event.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Booking for</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.name || user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Code Placeholder or Ticket Number */}
              <div className="flex justify-center pt-4 mb-5">
                <div className="bg-gray-100 p-3 rounded-lg border-5 border-dotted border-white">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center mb-2">
                      <Ticket className="w-10 h-10 text-gray-500" />
                    </div>
                    <p className="text-xs text-gray-500">
                      Ticket QR & ID will be generated after payment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Decoration - Bottom circles */}
          <div className="absolute -bottom-5 left-1/2 border-gray-700/5 transform -translate-x-1/2 w-10 h-10 bg-gray-800/24 rounded-full"></div>
        </div>

        {/* Waiting List Alert */}
        {isWaitingList && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  All Slots are Full!
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  You can still join the waiting queue. You'll be auto assigned
                  the ticket if a slot becomes available.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Age Restriction Alert */}
        {/* Age Restriction Alert */}
{!isAgeEligible && (
  <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-start space-x-3">
      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-red-800">Age Restriction!</p>
        <p className="text-sm text-red-700 mt-1">
          This event is for people who are {event.ageLimit}+ years old. 
          {userAge !== null 
            ? ` You are currently ${userAge} years old.` 
            : ' Please update your date of birth in your profile to verify age.'}
          {userAge !== null && ' Currently you can\'t book this event.'}
        </p>
      </div>
    </div>
  </div>
)}

        {/* Action Button */}
        <button
          onClick={handleProceedToPayment}
          disabled={!isAgeEligible}
          className={`w-full mt-6 py-4 px-6 rounded-lg font-semibold text-white transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2 hover:cursor-pointer ${
            !isAgeEligible
              ? "bg-gray-400 cursor-not-allowed"
              : isWaitingList
              ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span>
            {!isAgeEligible
              ? `Age ${event.ageLimit}+ Required`
              : isWaitingList
              ? "Proceed to Pay & Join Waiting Queue"
              : "Confirm & Proceed to Pay"}
          </span>
        </button>

        {/* Terms Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          By proceeding, you agree to our terms and conditions and cancellation
          policy.
        </p>
      </div>
    </div>
  );
};

export default BookEvent;
