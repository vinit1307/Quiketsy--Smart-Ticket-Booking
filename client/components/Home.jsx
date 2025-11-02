import React from 'react';
import Carousel from "./Carousel";
import EventsSection from "./EventsSection";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import { useAllCategories } from "../hooks/useEvents";
import Carousel2 from './Carousel2';
import { useAuth } from '../contexts/AuthContext';

import { useRecommendations } from "../hooks/useRecommendations";
import { FaStar } from 'react-icons/fa';

const Home = () => {
  const { categories, loading, error } = useAllCategories();
  
  const { user } = useAuth();
  const userId = user?.id || null;
  const {
    recommendations, 
    loading: recommendationsLoading, 
    error: recommendationsError 
  } = useRecommendations(userId);

  if (loading) {
    return (
      <div className="mt-9 w-full">
        <Carousel2 />
        {/* <Carousel
          autoplay={true}
          autoplayDelay={3000}
          pauseOnHover={true}
          loop={true}
          round={false}
        /> */}
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-9 w-full">
        <Carousel2 />
        {/* <Carousel
          autoplay={true}
          autoplayDelay={3000}
          pauseOnHover={true}
          loop={true}
          round={false}
        /> */}
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="mt-9 w-full">
      <Carousel2 />
      {/* <Carousel
        autoplay={true}
        autoplayDelay={3000}
        pauseOnHover={true}
        loop={true}
        round={false}
      /> */}
      
      {/* {categories.map((category) => (
        <EventsSection
          key={category.key}
          categoryKey={category.key}
          title={category.title}
          icon={category.icon}
          events={category.events}
        />
      ))} */}

        {categories.map((category) => (
        <EventsSection
          key={category.key}
          categoryKey={category.key}
          title={category.title}
          icon={category.icon}
          events={category.events}
          displayCount={category.displayCount || 4} // Pass displayCount from config
        />
      ))}

      {/* NEW: Recommended Events Section - Place it at the top for better visibility */}
      {userId && !recommendationsLoading && !recommendationsError && recommendations.length > 0 && (
        <EventsSection
          categoryKey="recommended"
          title="Recommended for You"
          icon={FaStar}
          events={recommendations}
          displayCount={5} // Show all 5 recommendations
        />
      )}
      
      {/* NEW: Loading state for recommendations (optional - shows skeleton) */}
      {userId && recommendationsLoading && (
        <div className="mt-10 px-6 md:px-11">
          <div className="animate-pulse">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="flex space-x-6 overflow-x-auto">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="min-w-[250px] h-60 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;

// import React, { useState, useEffect } from 'react';
// import Carousel from "./Carousel";
// import EventsSection from "./EventsSection";
// import { TrendingUp, Music, Heart } from "lucide-react";
// import { 
//   trendingEventsData, 
//   musicEventsData, 
//   recommendedEventsData 
// } from "../data/eventsData";

// const Home = () => {
//   const [trendingEvents, setTrendingEvents] = useState(trendingEventsData); // Initialize directly
//   const [musicEvents, setMusicEvents] = useState(musicEventsData); // Initialize directly
//   const [recommendedEvents, setRecommendedEvents] = useState(recommendedEventsData); // Initialize directly

//   // Remove useEffect for now since we're using static data
//   // useEffect(() => {
//   //   setTrendingEvents(trendingEventsData);
//   //   setMusicEvents(musicEventsData);
//   //   setRecommendedEvents(recommendedEventsData);
//   // }, []);

//   console.log("Home - Events loaded:", {
//     trending: trendingEvents.length,
//     music: musicEvents.length,
//     recommended: recommendedEvents.length
//   });

//   return (
//     <div className="mt-9 w-full">
//       <Carousel
//         autoplay={true}
//         autoplayDelay={3000}
//         pauseOnHover={true}
//         loop={true}
//         round={false}
//       />

//       <EventsSection 
//         title="Trending Events"
//         icon={TrendingUp}
//         events={trendingEvents}
//       />
      
//       <EventsSection 
//         title="Music Events"
//         icon={Music}
//         events={musicEvents}
//       />
      
//       <EventsSection 
//         title="You May Also Like"
//         icon={Heart}
//         events={recommendedEvents}
//       />
//     </div>
//   );
// };

// export default Home;