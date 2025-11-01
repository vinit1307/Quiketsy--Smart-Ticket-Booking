import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCategoryEvents, useCityEvents } from "../hooks/useEvents"; // Changed from useEvents to useCategoryEvents
import EventsService from "../services/eventsService";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import { MapPin } from 'lucide-react';

// console.log('Current path:', window.location.pathname);
// console.log('Params:', params);
// console.log('Is City Route:', isCity);
// console.log('City:', city);
// console.log('Category:', category);

const AllEventsPage = () => {
  const { category, city } = useParams();
  const navigate = useNavigate();
  // const { events, loading, error } = useCategoryEvents(category); // Using useCategoryEvents with the category param
  const isCity = window.location.pathname.startsWith('/events/city/');

  const { events, loading, error } = isCity
  ? useCityEvents(city) // You'll need to create this hook
  : useCategoryEvents(category);

  

  // Get category metadata
  const { title, icon: IconComponent } = EventsService.getCategoryMeta(category);

  // Handle invalid category
  // React.useEffect(() => {
  //   // Check if category exists in the database
  //   const validCategories = ['trending', 'music', 'recommended', 'plays', 'standup', 'art', 'technology', 'workshop', 'sports'];
  //   if (!validCategories.includes(category)) {
  //     navigate('/');
  //   }
  // }, [category, navigate]);

  // Update the validCategories check to exclude city routes:
React.useEffect(() => {
  if (!isCity) {  // Only validate if it's a category route
    const validCategories = ['trending', 'music', 'recommended', 'plays', 'standup', 'art', 'technology', 'workshop', 'sports'];
    if (!validCategories.includes(category)) {
      navigate('/');
    }
  }
}, [category, navigate, isCity]);

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="px-6 md:px-11 py-8">
      {/* Header */}
      {/* <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <IconComponent className="text-[#008CFF] w-6 h-6" />
          <h2 className="text-2xl font-bold text-gray-800">
            All {title}
          </h2>
        </div>
        <Link 
          to="/" 
          className="text-gray-600 hover:text-[#008CFF] transition-colors"
        >
          ← Back to Home
        </Link>
      </div> */}

      <div className="flex items-center justify-between mb-6">
  <div className="flex items-center space-x-2">
    {isCity ? (
      <>
        <MapPin className="text-[#008CFF] w-6 h-6" />
        <h2 className="text-2xl font-bold text-gray-800">
          Events happening in {city}
        </h2>
      </>
    ) : (
      <>
        <IconComponent className="text-[#008CFF] w-6 h-6" />
        <h2 className="text-2xl font-bold text-gray-800">
          All {title}
        </h2>
      </>
    )}
  </div>
  <Link 
    to="/" 
    className="text-gray-600 hover:text-[#008CFF] transition-colors"
  >
    ← Back to Home
  </Link>
</div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <Link key={event.id} to={`/event/${event.id}`}>
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all hover:scale-105 cursor-pointer h-full transition transform hover:shadow-blue-500/50 hover:shadow-xl">
              <div className="relative">
                <img
                  src={event.image || event.imageUrl}
                  alt={event.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Event';
                  }}
                />
                <div className="absolute bottom-2 left-2 bg-[#008CFF] text-white text-sm font-semibold px-2 py-1 rounded-md shadow">
                  {event.date || event.eventDate}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-base font-bold text-gray-900 line-clamp-2">
                  {event.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-1">{event.venue}</p>
                {(event.price || event.ticketPrice) && (
                  <p className="text-sm font-semibold text-[#008CFF] mt-1">
                    ₹{event.price || event.ticketPrice}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {events.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No events found in this category.</p>
          <Link to="/" className="text-[#008CFF] hover:underline mt-2 inline-block">
            Browse all events
          </Link>
        </div>
      )}
    </div>
  );
};

export default AllEventsPage;

// import React from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import { useEvents } from "../hooks/useEvents";
// import EventsService from "../services/eventsService";
// import LoadingSpinner from "./LoadingSpinner";
// import ErrorMessage from "./ErrorMessage";

// const AllEventsPage = () => {
//   const { category } = useParams();
//   const navigate = useNavigate();
//   const { events, loading, error } = useEvents(category);
  
//   // Get category metadata
//   const { title, icon: IconComponent } = EventsService.getCategoryMeta(category);

//   // Handle invalid category
//   React.useEffect(() => {
//     if (!loading && !error && events.length === 0) {
//       // Invalid category, redirect to home
//       navigate('/');
//     }
//   }, [loading, error, events, navigate]);

//   if (loading) {
//     return <LoadingSpinner fullPage />;
//   }

//   if (error) {
//     return <ErrorMessage message={error} />;
//   }

//   return (
//     <div className="px-6 md:px-11 py-8">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center space-x-2">
//           <IconComponent className="text-blue-600 w-6 h-6" />
//           <h2 className="text-2xl font-bold text-gray-800">
//             All {title}
//           </h2>
//         </div>
//         <Link
//           to="/"
//           className="text-gray-600 hover:text-blue-600 transition-colors"
//         >
//           ← Back to Home
//         </Link>
//       </div>

//       {/* Events Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {events.map((event) => (
//           <Link key={event.id} to={`/event/${event.id}`}>
//             <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all hover:scale-105 cursor-pointer h-full">
//               <div className="relative">
//                 <img
//                   src={event.image}
//                   alt={event.name}
//                   className="w-full h-48 object-cover"
//                   onError={(e) => {
//                     e.target.src = 'https://via.placeholder.com/400x300?text=Event';
//                   }}
//                 />
//                 <div className="absolute bottom-2 left-2 bg-[#008CFF] text-white text-sm font-semibold px-2 py-1 rounded-md shadow">
//                   {event.date}
//                 </div>
//               </div>
//               <div className="p-3">
//                 <h3 className="text-base font-bold text-gray-900 line-clamp-2">
//                   {event.name}
//                 </h3>
//                 <p className="text-sm text-gray-600 line-clamp-1">{event.venue}</p>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>

//       {/* Empty State */}
//       {events.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-gray-500 text-lg">No events found in this category.</p>
//           <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
//             Browse all events
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllEventsPage;


// import React, { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { TrendingUp } from "lucide-react"; // Fallback icon

// const AllEventsPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [IconComponent, setIconComponent] = useState(null);
  
//   // Get the data passed from EventsSection
//   const { title, iconKey, events } = location.state || {};

//   useEffect(() => {
//     // Retrieve the icon component from the temporary storage
//     if (iconKey && window.__tempNavIcons && window.__tempNavIcons[iconKey]) {
//       setIconComponent(() => window.__tempNavIcons[iconKey]);
//       // Clean up after retrieving
//       delete window.__tempNavIcons[iconKey];
//     }
//   }, [iconKey]);

//   // If no data passed, redirect to home
//   useEffect(() => {
//     if (!location.state || !events || events.length === 0) {
//       navigate('/');
//     }
//   }, [location.state, events, navigate]);

//   if (!location.state || !events) {
//     return (
//       <div className="px-6 md:px-11 py-8">
//         <p>No events to display. Redirecting...</p>
//       </div>
//     );
//   }

//   // Use fallback icon if IconComponent is not available
//   const Icon = IconComponent || TrendingUp;

//   return (
//     <div className="px-6 md:px-11 py-8">
//       <div className="flex items-center space-x-2 mb-6">
//         <Icon className="text-blue-600 w-6 h-6" />
//         <h2 className="text-2xl font-bold text-gray-800">
//           All {title}
//         </h2>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {events.map((event) => (
//           <Link key={event.id} to={`/event/${event.id}`}>
//             <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
//               <div className="relative">
//                 <img
//                   src={event.image}
//                   alt={event.name}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="absolute bottom-2 left-2 bg-[#008CFF] text-white text-sm font-semibold px-2 py-1 rounded-md shadow">
//                   {event.date}
//                 </div>
//               </div>
//               <div className="p-3">
//                 <h3 className="text-base font-bold text-gray-900">{event.name}</h3>
//                 <p className="text-sm text-gray-600">{event.venue}</p>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AllEventsPage;