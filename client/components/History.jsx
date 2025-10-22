import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHistory } from "react-icons/fa";

const History = () => {
  const [history, setHistory] = useState([
    {
      id: 1,
      name: "Arijit Singh Live Concert",
      status: "Confirmed",
      price: "₹1200",
      date: "2025-10-15",
      venue: "NSCI Dome, Mumbai",
      time: "7:00 PM",
      bookedDate: "2025-09-28",
    },
    {
      id: 2,
      name: "Standup Comedy Night",
      status: "Cancelled",
      price: "₹499",
      date: "2025-10-10",
      venue: "Habitat, Delhi",
      time: "8:00 PM",
      bookedDate: "2025-09-25",
    },

    {
      id: 2,
      name: "Standup Comedy Night",
      status: "Waitlist",
      price: "₹499",
      date: "2025-10-10",
      venue: "Habitat, Delhi",
      time: "8:00 PM",
      bookedDate: "2025-09-25",
    },
  ]);

  useEffect(() => {
    // Later: Fetch from backend
  }, []);

  return (
    <div className="p-6 mt-15 flex justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="flex items-center text-3xl font-bold mb-7"> <FaHistory className="mr-2 h-7 w-7 align-middle mt-1" />Booking History</h2>

        <div className="space-y-7">
          {history.map((event) => (
            <div
              key={event.id}
              className="p-7 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Top Row: Event Name + Status */}
              <div className="flex justify-between items-center pb-2 mb-3">
                
                <h3 className="text-xl font-bold">{event.name}</h3>
                <span
                  className={` px-3 py-1 p-2 rounded-full text-sm font-medium ${
                    event.status === "Confirmed"
                      ? "bg-green-100 text-green-700"
                      : event.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {event.status}
                </span>
              </div>
              <hr className="mt-3 mb-5.5 border-black" />

              {/* Details */}
              <div className="text-black space-y-1 text-sm">
                <p>
                  <strong>Price:</strong> {event.price}
                </p>
                <p>
                  <strong>Date:</strong> {event.date}
                </p>
                <p>
                  <strong>Venue:</strong> {event.venue}
                </p>
                <p>
                  <strong>Time:</strong> {event.time}
                </p>
                <p>
                  <strong>Booked Date:</strong> {event.bookedDate}
                </p>
              </div>

              {/* More Details Link */}
              
              <div className="flex justify-between items-center mt-5">
                <div className="text-left">
                <Link
                  to={`/event/${event.id}`}
                  className="text-white bg-[#008CFF] rounded-full text-sm font-medium flex justify-between items-center py-1 px-3 opacity-90 hover:opacity-100 transition"
                >
                Booking Details
                </Link>
                </div>
                <div className="text-right">
                <Link
                  to={`/event/${event.id}`}
                  className="text-[#008CFF] hover:underline text-sm font-medium"
                >
                Event Details →
                </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
