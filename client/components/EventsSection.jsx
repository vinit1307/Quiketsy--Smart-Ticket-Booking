// UnComment it when we are fetching from backend
// EventsSection.jsx
import React from "react";
import { Link } from "react-router-dom";

const EventsSection = ({ 
  categoryKey, 
  title, 
  icon: IconComponent,
  events = [],
  displayCount = 4  // Default display count
}) => {
  // If no events, show empty state
  if (!events || events.length === 0) {
    return (
      <div className="mt-10 px-6 md:px-11">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            {IconComponent && (
              <IconComponent className="text-[#008CFF] mt-0.5 w-5 h-5 md:w-6 md:h-6" />
            )}
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              {title}
            </h2>
          </div>
        </div>
        <div className="text-gray-500">No events available in this category</div>
      </div>
    );
  }

  // Format events data (handle both backend formats)
  const formattedEvents = events.map(event => ({
  id: event.eventId || event.id, // Handle both field names
  name: event.name,
  venue: event.venue,
  date: event.eventDate || event.date,
  image: event.imageUrl || event.image,
  price: event.ticketPrice || event.price,
  duration: event.duration,
  time: event.startTime || event.time,
  ageLimit: event.ageLimit || event.agelimit,
  about: event.description || event.about,
}));

  // Slice events based on displayCount
  const displayEvents = formattedEvents.slice(0, displayCount);

  return (
    <div className="mt-10 px-6 md:px-11">
      {/* Header row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          {IconComponent && (
            <IconComponent className="text-[#008CFF] mt-0.5 w-5 h-5 md:w-6 md:h-6" />
          )}
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            {title}
          </h2>
        </div>
        {formattedEvents.length > displayCount && (
          <Link
            to={`/events/${categoryKey}`}
            className="text-[#008CFF] hover:underline font-medium cursor-pointer px-2 py-1 rounded hover:bg-blue-50 transition-all"
          >
            See All ({formattedEvents.length}) ➝
          </Link>
        )}
      </div>

      {/* Horizontal Scroll Cards */}
      <div className="flex space-x-6 overflow-x-auto pb-3 scrollbar-hide">
        {displayEvents.map((event) => (
          <Link key={event.id} to={`/event/${event.id}`}>
            <div className="min-w-[250px] bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition transform hover:shadow-cyan-500/50 hover:shadow-xl">
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjIwMCIgeT0iMTUwIiBzdHlsZT0iZmlsbDojOTk5O2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjIwcHg7Zm9udC1mYW1pbHk6QXJpYWwsc2Fucy1zZXJpZiI+RXZlbnQgSW1hZ2U8L3RleHQ+PC9zdmc+';
                  }}
                />
                <div className="absolute bottom-2 left-2 bg-[#008CFF] text-white text-sm font-semibold px-2 py-1 rounded-md shadow">
                  {event.date}
                </div>
                
{categoryKey === 'recommended' && (
  <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
    ⭐ For You
  </div>
)}
                {/* {categoryKey === 'trending' && (
                  <div className="absolute top-2 right-2  text-white text-xm font-bold px-2 py-1 rounded-md shadow">
                    🔥
                  </div>
                )} */}
              </div>
              <div className="p-3">
                <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                  {event.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-1">{event.venue}</p>
                {event.price && (
                  <p className="text-sm font-semibold text-[#008CFF] mt-1">₹{event.price}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EventsSection;

// Comment it when we are fetching from backend
// import React from "react";
// import { Link } from "react-router-dom";

// const EventsSection = ({ categoryKey, title, icon: IconComponent, events }) => {
//   // No need for navigation state - just use URL!
  
//   return (
//     <div className="mt-10 px-6 md:px-11">
//       {/* Header row */}
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center space-x-2">
//           <IconComponent className="text-[#008CFF] mt-0.5 w-5 h-5 md:w-6 md:h-6" />
//           <h2 className="text-xl md:text-2xl font-bold text-gray-800">
//             {title}
//           </h2>
//         </div>
//         <Link
//           to={`/events/${categoryKey}`}
//           className="text-[#008CFF] hover:underline font-medium cursor-pointer px-2 py-1 rounded hover:bg-blue-50 transition-all"
//         >
//           See All ➝
//         </Link>
//       </div>

//       {/* Horizontal Scroll Cards - Show only first 4 */}
//       <div className="flex space-x-6 overflow-x-auto pb-3 scrollbar-hide">
//         {events && events.length > 0 ? (
//           events.slice(0, 4).map((event) => (
//             <Link key={event.id} to={`/event/${event.id}`}>
//               <div className="min-w-[250px] bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition">
//                 <div className="relative">
//                   <img
//                     src={event.image}
//                     alt={event.name}
//                     className="w-full h-40 object-cover"
//                     onError={(e) => {
//                       e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjIwMCIgeT0iMTUwIiBzdHlsZT0iZmlsbDojOTk5O2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjIwcHg7Zm9udC1mYW1pbHk6QXJpYWwsc2Fucy1zZXJpZiI+RXZlbnQgSW1hZ2U8L3RleHQ+PC9zdmc+';
//                     }}
//                   />
//                   <div className="absolute bottom-2 left-2 bg-[#008CFF] text-white text-sm font-semibold px-2 py-1 rounded-md shadow">
//                     {event.date}
//                   </div>
//                 </div>
//                 <div className="p-3">
//                   <h3 className="text-base font-bold text-gray-900 line-clamp-1">
//                     {event.name}
//                   </h3>
//                   <p className="text-sm text-gray-600 line-clamp-1">{event.venue}</p>
//                 </div>
//               </div>
//             </Link>
//           ))
//         ) : (
//           <div className="text-gray-500">No events available</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EventsSection;


// Just a fall back option don't do anyhting with it
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

// const EventsSection = ({ title, icon: IconComponent, events }) => {
//   const navigate = useNavigate();

//   const handleSeeAll = () => {
//     if (!events || events.length === 0) {
//     console.error("No events to show!");
//     return;
//   }
//     // Generate a unique key for this navigation
//     const navigationKey = `events_${Date.now()}`;
    
//     // Store the icon component in a temporary window object
//     if (!window.__tempNavIcons) {
//       window.__tempNavIcons = {};
//     }
//     window.__tempNavIcons[navigationKey] = IconComponent;
    
//     // Navigate with the key instead of the component
//     navigate('/all-events', { 
//       state: { 
//         title, 
//         iconKey: navigationKey,
//         events 
//       } 
//     });
//   };

//   return (
//     <div className="mt-10 px-6 md:px-11">
//       {/* Header row */}
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center space-x-2">
//           <IconComponent className="text-[#008CFF] w-5 h-5 md:w-6 md:h-6" />
//           <h2 className="text-xl md:text-2xl font-bold text-gray-800">
//             {title}
//           </h2>
//         </div>
//         <button
//           onClick={handleSeeAll}
//           className="text-[#008CFF] hover:underline font-medium cursor-pointer px-2 py-1"
//         >
//           See All ➝
//         </button>
//       </div>

//       {/* Horizontal Scroll Cards - Show only first 4 */}
//       <div className="flex space-x-6 overflow-x-auto pb-3 scrollbar-hide">
//         {events && events.length > 0 ? (
//           events.slice(0, 4).map((event) => (
//             <Link key={event.id} to={`/event/${event.id}`}>
//               <div className="min-w-[250px] bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition">
//                 <div className="relative">
//                   <img
//                     src={event.image}
//                     alt={event.name}
//                     className="w-full h-40 object-cover"
//                   />
//                   <div className="absolute bottom-2 left-2 bg-[#008CFF] text-white text-sm font-semibold px-2 py-1 rounded-md shadow">
//                     {event.date}
//                   </div>
//                 </div>
//                 <div className="p-3">
//                   <h3 className="text-base font-bold text-gray-900">
//                     {event.name}
//                   </h3>
//                   <p className="text-sm text-gray-600">{event.venue}</p>
//                 </div>
//               </div>
//             </Link>
//           ))
//         ) : (
//           <div className="text-gray-500">No events available</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EventsSection;