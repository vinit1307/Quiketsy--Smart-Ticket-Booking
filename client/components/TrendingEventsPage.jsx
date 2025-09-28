// src/components/TrendingEventsPage.jsx
import React from "react";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const allEvents = [
  {
    id: 1,
    name: "Coldplay Concert",
    venue: "Mumbai Stadium",
    date: "25 Sep",
    image: "https://c.ndtvimg.com/2025-01/6eb4u4ko_coldplay_625x300_18_January_25.jpeg?downsize=773:435",
  },
  {
    id: 2,
    name: "Stand-up Comedy Night",
    venue: "Delhi Club",
    date: "30 Sep",
    image: "https://igimage.indiaglitz.com/hindi/news/Adobe_Express_20230101_1213350_1-594.png",
  },
  {
    id: 3,
    name: "Art Exhibition",
    venue: "Bangalore Art Gallery",
    date: "5 Oct",
    image: "https://images.stockcake.com/public/2/3/9/2397d77f-af92-4b51-8bb9-d60d138cf4d0_large/vibrant-art-exhibition-stockcake.jpg",
  },
  {
    id: 4,
    name: "Food Festival",
    venue: "Hyderabad Grounds",
    date: "12 Oct",
    image: "https://www.shutterstock.com/image-photo/chiang-mai-thailand-july-222023-600nw-2385705239.jpg",
  },
  {
    id: 5,
    name: "Tech Conference",
    venue: "Chennai Convention Center",
    date: "15 Oct",
    image: "https://www.allerin.com/hubfs/Blog_pics/Artificial%20Intelligence%20in%20Conferences.jpg",
  },
  {
    id: 6,
    name: "Film Festival",
    venue: "Kolkata Theatre",
    date: "20 Oct",
    image: "https://www.shutterstock.com/image-photo/people-red-carpet-event-hollywood-260nw-1383241659.jpg",
  },
];

const TrendingEventsPage = () => {
  return (
    <div className="px-6 md:px-11 py-8">
        <div className="flex items-center space-x-2">
          <TrendingUp className="text-blue-600 w-6 h-6 mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            All Trending Events
          </h2>
        </div>
        
      

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allEvents.map((event) => (
          <Link key={event.id} to={`/event/${event.id}`}>
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
            <div className="relative">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-blue-700 text-white text-sm font-semibold px-2 py-1 rounded-md shadow">
                {event.date}
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-base font-bold text-gray-900">{event.name}</h3>
              <p className="text-sm text-gray-600">{event.venue}</p>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingEventsPage;
