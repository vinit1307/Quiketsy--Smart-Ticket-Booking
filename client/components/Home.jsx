import React from 'react';
import Carousel from "./Carousel";
import EventsSection from "./EventsSection";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import { useAllCategories } from "../hooks/useEvents";

const Home = () => {
  const { categories, loading, error } = useAllCategories();

  if (loading) {
    return (
      <div className="mt-9 w-full">
        <Carousel
          autoplay={true}
          autoplayDelay={3000}
          pauseOnHover={true}
          loop={true}
          round={false}
        />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-9 w-full">
        <Carousel
          autoplay={true}
          autoplayDelay={3000}
          pauseOnHover={true}
          loop={true}
          round={false}
        />
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="mt-9 w-full">
      <Carousel
        autoplay={true}
        autoplayDelay={3000}
        pauseOnHover={true}
        loop={true}
        round={false}
      />
      
      {categories.map((category) => (
        <EventsSection
          key={category.key}
          categoryKey={category.key}
          title={category.title}
          icon={category.icon}
          events={category.events}
        />
      ))}

        {/* {categories.map((category) => (
        <EventsSection
          key={category.key}
          categoryKey={category.key}
          title={category.title}
          icon={category.icon}
          events={category.events}
          displayCount={category.displayCount || 4} // Pass displayCount from config
        />
      ))} */}

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