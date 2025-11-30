// Comment it and uncomment below when we are feteching from backend
// import { useState, useEffect } from 'react';
// import EventsService from '../services/eventsService';

// export const useEvents = (category) => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const data = await EventsService.getEventsByCategory(category);
//         setEvents(data);
//       } catch (err) {
//         setError(err.message || 'Failed to fetch events');
//         setEvents([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (category) {
//       fetchEvents();
//     }
//   }, [category]);

//   return { events, loading, error };
// };

// export const useAllCategories = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const data = await EventsService.getAllCategories();
//         setCategories(data);
//       } catch (err) {
//         setError(err.message || 'Failed to fetch categories');
//         setCategories([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   return { categories, loading, error };
// };

// Uncomment it when we are fetching fetching from backend
// // hooks/useEvents.js
import { useState, useEffect } from 'react';
import EventsService from '../services/eventsService';
import { TrendingUp, Music, Theater, Mic, Palette, Heart } from 'lucide-react';
import { FaLaptopCode } from "react-icons/fa";
import { GrWorkshop } from "react-icons/gr";
import { MdOutlineSportsMartialArts } from "react-icons/md";
import { SiSparkfun } from "react-icons/si";
import { UsersRound } from 'lucide-react';

// Define your category configuration
// const CATEGORY_CONFIG = [
//   {
//     key: 'trending',
//     title: 'Trending Events 🔥',
//     icon: TrendingUp,
//     displayCount: 5
//   },
//   {
//     key: 'Music',
//     title: 'Music Events',
//     icon: Music,
//     displayCount: 4
//   },
//   {
//     key: 'Plays',
//     title: 'Theater & Plays',
//     icon: Theater,
//     displayCount: 4
//   },
//   {
//     key: 'Stand Up',
//     title: 'Stand-up Comedy',
//     icon: Mic,
//     displayCount: 4
//   },
//   {
//     key: 'Art',
//     title: 'Arts & Culture',
//     icon: Palette,
//     displayCount: 4
//   },

//   {
//     key: 'Technology',
//     title: 'Technology',
//     icon: Palette,
//     displayCount: 4
//   },

//   {
//     key: 'Workshop',
//     title: 'Workshops',
//     icon: Palette,
//     displayCount: 4
//   }

// ];

const CATEGORY_CONFIG = [
  { key: 'trending', title: 'Trending Events', icon: TrendingUp, displayCount: 7 },
  { key: 'music', title: 'Music Events', icon: Music, displayCount: 7 },
  { key: 'plays', title: 'Theater & Plays', icon: Theater, displayCount: 7 },
  { key: 'standup', title: 'Stand-up Comedy', icon: Mic, displayCount: 7 },
  { key: 'activity', title: 'Fun Activities', icon: SiSparkfun, displayCount: 7 },
  { key: 'conference', title: 'Conferences', icon: UsersRound, displayCount: 7 },
  { key: 'workshop', title: 'Workshops', icon: GrWorkshop, displayCount: 7 },
  { key: 'sports', title: 'Sports', icon: MdOutlineSportsMartialArts, displayCount: 7 }
];

export const useAllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all categories in parallel for better performance
        const categoryPromises = CATEGORY_CONFIG.map(async (config) => {
          try {
            const events = await EventsService.getEventsByCategory(config.key);
            return {
              ...config,
              events: events || []
            };
          } catch (err) {
            console.error(`Error fetching ${config.key} events:`, err);
            // Return the category with empty events on error
            return {
              ...config,
              events: []
            };
          }
        });

        const fetchedCategories = await Promise.all(categoryPromises);
        
        // Filter out categories with no events if you want
        // const categoriesWithEvents = fetchedCategories.filter(cat => cat.events.length > 0);
        
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load events. Please try again later.');
        // Set default categories with empty events on error
        setCategories(CATEGORY_CONFIG.map(config => ({ ...config, events: [] })));
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  return { categories, loading, error };
};

export const useEvents = useAllCategories;
// You can also export individual category hooks if needed
export const useTrendingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await EventsService.getTrendingEvents();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return { events, loading, error };
};

// In hooks/useEvents.js, add:
export const useCityEvents = (city) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await EventsService.getEventsByCity(city);
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (city) {
      fetchEvents();
    }
  }, [city]);

  return { events, loading, error };
};

export const useCategoryEvents = (category) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await EventsService.getEventsByCategory(category);
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (category) {
      fetchEvents();
    }
  }, [category]);

  return { events, loading, error };
};