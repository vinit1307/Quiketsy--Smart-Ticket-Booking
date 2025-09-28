import React from "react";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const TrendingEvents = () => {
  // Dummy event data (you can replace with API later)
  const events = [
    {
      id: 1,
      name: "Coldplay Concert",
      venue: "Mumbai Stadium",
      date: "25 Sep",
      image:
        "https://c.ndtvimg.com/2025-01/6eb4u4ko_coldplay_625x300_18_January_25.jpeg?downsize=773:435",
    },
    {
      id: 2,
      name: "Stand-up Comedy Night",
      venue: "Delhi Club",
      date: "30 Sep",
      image:
        "https://igimage.indiaglitz.com/hindi/news/Adobe_Express_20230101_1213350_1-594.png",
    },
    {
      id: 3,
      name: "Art Exhibition",
      venue: "Bangalore Art Gallery",
      date: "5 Oct",
      image:
        "https://images.stockcake.com/public/2/3/9/2397d77f-af92-4b51-8bb9-d60d138cf4d0_large/vibrant-art-exhibition-stockcake.jpg",
    },
    {
      id: 4,
      name: "Food Festival",
      venue: "Hyderabad Grounds",
      date: "12 Oct",
      image:
        "https://www.shutterstock.com/image-photo/chiang-mai-thailand-july-222023-600nw-2385705239.jpg",
    },
  ];

  return (
    <div className="mt-10 px-6 md:px-11">
      {/* Header row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="text-blue-600 w-5 h-5 md:w-6 h-6" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Trending Events
          </h2>
        </div>
        <Link
          to="/events"
          className="text-blue-600 hover:underline font-medium"
        >
          See All ➝
        </Link>
      </div>

      {/* Horizontal Scroll Cards */}
      <div className="flex space-x-6 overflow-x-auto pb-3 scrollbar-hide">
        {events.map((event) => (
          <Link key={event.id} to={`/event/${event.id}`}>
            <div className="min-w-[250px] bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition">
            <div className="relative">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-40 object-cover"
              />
              {/* Date overlay */}
              <div className="absolute bottom-2 left-2 bg-blue-700 text-white text-sm font-semibold px-2 py-1 rounded-md shadow">
                {event.date}
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-base font-bold text-gray-900">
                {event.name}
              </h3>
              <p className="text-sm text-gray-600">{event.venue}</p>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingEvents;
