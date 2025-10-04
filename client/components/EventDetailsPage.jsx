import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays } from 'lucide-react';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiParentLine } from "react-icons/ri";
import { GiDuration } from "react-icons/gi";
import { MdTimelapse } from "react-icons/md";
import { IoTicket } from "react-icons/io5";
import EventsService from "../services/eventsService";
import LoadingSpinner from "./LoadingSpinner";

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = await EventsService.getEventById(id);
        
        if (eventData) {
          // Add additional details that might not be in the service
          const enrichedEvent = {
            ...eventData,
            price: eventData.price || "2500",
            duration: eventData.duration || "2 Hours",
            time: eventData.time || "7:00 PM Onwards",
            agelimit: eventData.agelimit || "All Ages",
            about: eventData.about || `Join us for ${eventData.name}! This will be an amazing experience at ${eventData.venue}. Don't miss out on this incredible event happening on ${eventData.date}.`
          };
          setEvent(enrichedEvent);
        } else {
          // Event not found
          setEvent(null);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
        <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-8">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">{event.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Content */}
        <div className="lg:col-span-2">
          {/* Cover Image */}
          <img
            src={event.image}
            alt={event.name}
            className="rounded-xl shadow-md w-full h-96 object-cover mb-9"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjIwMCIgeT0iMTUwIiBzdHlsZT0iZmlsbDojOTk5O2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjIwcHg7Zm9udC1mYW1pbHk6QXJpYWwsc2Fucy1zZXJpZiI+RXZlbnQgSW1hZ2U8L3RleHQ+PC9zdmc+';
            }}
          />

          {/* About Section */}
          <h2 className="text-xl font-semibold mb-2">About The Event</h2>
          <p className="text-gray-700 whitespace-pre-line">{event.about}</p>
        </div>

        {/* Info Card (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-10 bg-white shadow-lg rounded-xl p-5 border space-y-3">
            <div className="flex items-center space-x-3">
              <CalendarDays className="text-blue-600 w-5 h-5" />
              <p className="font-medium text-black">Date: {event.date}</p>
            </div>

            <div className="flex items-center space-x-3">
              <IoTicket className="text-blue-600 w-5 h-5" />
              <p className="font-medium text-black">Price: ₹ {event.price}/-</p>
            </div>

            <div className="flex items-center space-x-3">
              <MdTimelapse className="text-blue-600 w-5 h-5" />
              <p className="font-medium text-black">Time: {event.time}</p>
            </div>

            <div className="flex items-center space-x-3">
              <HiOutlineLocationMarker className="text-blue-600 w-5 h-5" />
              <p className="font-medium text-black">At: {event.venue}</p>
            </div>

            <div className="flex items-center space-x-3">
              <GiDuration className="text-blue-600 w-5 h-5" />
              <p className="font-medium text-black">Duration: {event.duration}</p>
            </div>

            <div className="flex items-center space-x-3">
              <RiParentLine className="text-blue-600 w-5 h-5" />
              <p className="font-medium text-black">Age Limit: {event.agelimit}</p>
            </div>

            <button className="w-full mt-3 bg-blue-700 text-white font-semibold py-2 rounded-lg hover:bg-blue-900">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;