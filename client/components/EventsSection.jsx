import React from "react";
import { Link } from "react-router-dom";

const EventsSection = ({ categoryKey, title, icon: IconComponent, events }) => {
  // No need for navigation state - just use URL!
  
  return (
    <div className="mt-10 px-6 md:px-11">
      {/* Header row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <IconComponent className="text-blue-600 mt-0.5 w-5 h-5 md:w-6 md:h-6" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            {title}
          </h2>
        </div>
        <Link
          to={`/events/${categoryKey}`}
          className="text-blue-600 hover:underline font-medium cursor-pointer px-2 py-1 rounded hover:bg-blue-50 transition-all"
        >
          See All ➝
        </Link>
      </div>

      {/* Horizontal Scroll Cards - Show only first 4 */}
      <div className="flex space-x-6 overflow-x-auto pb-3 scrollbar-hide">
        {events && events.length > 0 ? (
          events.slice(0, 4).map((event) => (
            <Link key={event.id} to={`/event/${event.id}`}>
              <div className="min-w-[250px] bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition">
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjIwMCIgeT0iMTUwIiBzdHlsZT0iZmlsbDojOTk5O2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjIwcHg7Zm9udC1mYW1pbHk6QXJpYWwsc2Fucy1zZXJpZiI+RXZlbnQgSW1hZ2U8L3RleHQ+PC9zdmc+';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-blue-700 text-white text-sm font-semibold px-2 py-1 rounded-md shadow">
                    {event.date}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{event.venue}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-gray-500">No events available</div>
        )}
      </div>
    </div>
  );
};

export default EventsSection;

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
//           <IconComponent className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />
//           <h2 className="text-xl md:text-2xl font-bold text-gray-800">
//             {title}
//           </h2>
//         </div>
//         <button
//           onClick={handleSeeAll}
//           className="text-blue-600 hover:underline font-medium cursor-pointer px-2 py-1"
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
//                   <div className="absolute bottom-2 left-2 bg-blue-700 text-white text-sm font-semibold px-2 py-1 rounded-md shadow">
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