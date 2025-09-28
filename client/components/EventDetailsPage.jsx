// src/components/EventDetailsPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { CalendarDays } from 'lucide-react';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiParentLine } from "react-icons/ri";
import { GiDuration } from "react-icons/gi";
import { MdTimelapse } from "react-icons/md";

// Dummy event data (reuse your existing array)
const allEvents = [
  {
    id: 1,
    name: "Coldplay Concert",
    venue: "Mumbai Stadium",
    date: "25 Sep",
    image: "https://c.ndtvimg.com/2025-01/6eb4u4ko_coldplay_625x300_18_January_25.jpeg?downsize=773:435",
    about: "Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music.Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music.",
  },
  {
    id: 2,
    name: "Stand-up Comedy Night",
    venue: "Delhi Club",
    date: "30 Sep",
    image: "https://igimage.indiaglitz.com/hindi/news/Adobe_Express_20230101_1213350_1-594.png",
    about: "Laugh out loud with India's top comedians in a fun-packed night.",
  },
  {
      id: 3,
      name: "Art Exhibition",
      venue: "Bangalore Art Gallery",
      date: "5 Oct",
      image:
        "https://images.stockcake.com/public/2/3/9/2397d77f-af92-4b51-8bb9-d60d138cf4d0_large/vibrant-art-exhibition-stockcake.jpg",
      about: "Laugh out loud with India's top comedians in a fun-packed night.",
    },
    {
      id: 4,
      name: "Food Festival",
      venue: "Hyderabad Grounds",
      date: "12 Oct",
      image:
        "https://www.shutterstock.com/image-photo/chiang-mai-thailand-july-222023-600nw-2385705239.jpg",
      about: "Laugh out loud with India's top comedians in a fun-packed night.",
    },
  // add others...
];

const EventDetailsPage = () => {
  const { id } = useParams();
  const event = allEvents.find((e) => e.id === parseInt(id));

  if (!event) {
    return <div className="p-6">Event not found</div>;
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
          />

          {/* About Section */}
          <h2 className="text-xl font-semibold mb-2">About The Event</h2>
          <p className="text-gray-700">{event.about}</p>
        </div>

        {/* Info Card (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-10 bg-white shadow-lg rounded-xl p-5 border space-y-3">
            <div className="flex items-center space-x-3">
              <CalendarDays className="text-blue-600 w-5 h-5" />
              <p className="font-medium text-black"> {event.date}</p>
            </div>

            <div className="flex items-center space-x-3">
              <MdTimelapse className="text-blue-600 w-5 h-5" />
              <p className="font-medium text-black"> 3:15 PM Onwards</p>
            </div>

            <div className="flex items-center space-x-3">
              <HiOutlineLocationMarker className="text-blue-600 w-5 h-5" />
              <p className="font-medium text-black"> {event.venue}</p>
            </div>

            <div className="flex items-center space-x-3">
              <GiDuration className="text-blue-600 w-5 h-5" />
              <p className="font-medium text-black"> 2 Hours</p>
            </div>

            <div className="flex items-center space-x-3">
              <RiParentLine className="text-blue-600 w-5 h-5" />
              <p className="font-medium text-black"> Age Limit: 5+</p>
            </div>
            
            {/* <p className="flex items-center font-medium text-black mb-2"><HiOutlineLocationMarker /> {event.venue}</p>
            <p className="font-medium text-black mb-2">⏱ 2 Hours</p>
            <p className="font-medium text-black mb-4">Age Limit: 5+</p> */}
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
