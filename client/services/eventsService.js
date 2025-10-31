import { TrendingUp, Music, Heart, Theater, Mic, Palette} from "lucide-react";

// Temporary data - will be replaced with API calls
const eventsDatabase = {
  trending: {
    title: "Trending Events",
    icon: TrendingUp,
    events: [
      {
        id: 1,
        name: "Coldplay Concert",
        venue: "Mumbai Stadium",
        date: "25 Sep",
        price: "5500",
        duration: "3 Hours",
        time: "7:00 PM Onwards",
        agelimit: "12+",
        about:
          "Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Experience the band's greatest hits including 'Yellow', 'Paradise', 'Viva La Vida' and many more. This concert will feature stunning visual effects, confetti cannons, and the famous Xylobands that light up in sync with the music.",
        image:
          "https://www.warnermusic.de/uploads/media/image-1002-704/09/21529-FqJHoRqXsAEEs9h.jpg?v=1-7",
      },
      {
        id: 2,
        name: "Stand-up Comedy Night",
        venue: "Delhi Club",
        date: "30 Sep",
        price: "5500",
        duration: "3 Hours",
        time: "7:00 PM Onwards",
        agelimit: "12+",
        about:
          "Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Experience the band's greatest hits including 'Yellow', 'Paradise', 'Viva La Vida' and many more. This concert will feature stunning visual effects, confetti cannons, and the famous Xylobands that light up in sync with the music.",
        image:
          "https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-abhishek-upmanyu-live-0-2022-7-25-t-13-30-44.jpg",
      },
      {
        id: 3,
        name: "Art Exhibition",
        venue: "Bangalore Art Gallery",
        date: "5 Oct",
        price: "5500",
        duration: "3 Hours",
        time: "7:00 PM Onwards",
        agelimit: "12+",
        about:
          "Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Experience the band's greatest hits including 'Yellow', 'Paradise', 'Viva La Vida' and many more. This concert will feature stunning visual effects, confetti cannons, and the famous Xylobands that light up in sync with the music.",
        image:
          "https://images.stockcake.com/public/2/3/9/2397d77f-af92-4b51-8bb9-d60d138cf4d0_large/vibrant-art-exhibition-stockcake.jpg",
      },
      {
        id: 4,
        name: "Food Festival",
        venue: "Hyderabad Grounds",
        date: "12 Oct",
        price: "5500",
        duration: "3 Hours",
        time: "7:00 PM Onwards",
        agelimit: "12+",
        about:
          "Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Experience the band's greatest hits including 'Yellow', 'Paradise', 'Viva La Vida' and many more. This concert will feature stunning visual effects, confetti cannons, and the famous Xylobands that light up in sync with the music.",
        image:
          "https://www.shutterstock.com/image-photo/chiang-mai-thailand-july-222023-600nw-2385705239.jpg",
      },
      {
        id: 5,
        name: "Tech Conference",
        venue: "Chennai Convention Center",
        date: "15 Oct",
        price: "5500",
        duration: "3 Hours",
        time: "7:00 PM Onwards",
        agelimit: "12+",
        about:
          "Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Experience the band's greatest hits including 'Yellow', 'Paradise', 'Viva La Vida' and many more. This concert will feature stunning visual effects, confetti cannons, and the famous Xylobands that light up in sync with the music.",
        image:
          "https://www.travelperk.com/wp-content/uploads/alexandre-pellaes-6vAjp0pscX0-unsplash-1-1.jpg",
      },
      {
        id: 6,
        name: "Film Festival",
        venue: "Kolkata Theatre",
        date: "20 Oct",
        price: "5500",
        duration: "3 Hours",
        time: "7:00 PM Onwards",
        agelimit: "12+",
        about:
          "Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Experience the band's greatest hits including 'Yellow', 'Paradise', 'Viva La Vida' and many more. This concert will feature stunning visual effects, confetti cannons, and the famous Xylobands that light up in sync with the music.",
        image:
          "https://news.cgtn.com/news/2020-08-22/The-10th-Beijing-International-Film-Festival-kicks-off-on-August-22-TamA9SC9Ak/img/494c9e37685c47298977f1ed940f044f/494c9e37685c47298977f1ed940f044f.jpeg",
      },
    ],
  },
  music: {
    title: "Music Events",
    icon: Music,
    events: [
      {
        id: 7,
        name: "Rock Festival 2024",
        venue: "Goa Beach",
        date: "15 Nov",
        price: "5500",
        duration: "3 Hours",
        time: "7:00 PM Onwards",
        agelimit: "12+",
        about:
          "Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Experience the band's greatest hits including 'Yellow', 'Paradise', 'Viva La Vida' and many more. This concert will feature stunning visual effects, confetti cannons, and the famous Xylobands that light up in sync with the music.",
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
      },
      {
        id: 8,
        name: "Classical Music Night",
        venue: "Chennai Auditorium",
        date: "20 Nov",
        price: "5500",
        duration: "3 Hours",
        time: "7:00 PM Onwards",
        agelimit: "12+",
        about:
          "Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Experience the band's greatest hits including 'Yellow', 'Paradise', 'Viva La Vida' and many more. This concert will feature stunning visual effects, confetti cannons, and the famous Xylobands that light up in sync with the music.",
        image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae",
      },
      {
        id: 9,
        name: "EDM Party",
        venue: "Bangalore Club",
        date: "22 Nov",
        price: "5500",
        duration: "3 Hours",
        time: "7:00 PM Onwards",
        agelimit: "12+",
        about:
          "Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Experience the band's greatest hits including 'Yellow', 'Paradise', 'Viva La Vida' and many more. This concert will feature stunning visual effects, confetti cannons, and the famous Xylobands that light up in sync with the music.",
        image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1",
      },
      {
        id: 10,
        name: "Jazz Evening",
        venue: "Mumbai Jazz Club",
        date: "25 Nov",
        price: "5500",
        duration: "3 Hours",
        time: "7:00 PM Onwards",
        agelimit: "12+",
        about:
          "Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Experience the band's greatest hits including 'Yellow', 'Paradise', 'Viva La Vida' and many more. This concert will feature stunning visual effects, confetti cannons, and the famous Xylobands that light up in sync with the music.",
        image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f",
      },
    ],
  },
  recommended: {
    title: "You May Also Like",
    icon: Heart,
    events: [
      {
        id: 11,
        name: "Tech Talk 2024",
        venue: "Hyderabad Convention Center",
        date: "10 Dec",
        price: "5500",
        duration: "3 Hours",
        time: "7:00 PM Onwards",
        agelimit: "12+",
        about:
          "Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Experience the band's greatest hits including 'Yellow', 'Paradise', 'Viva La Vida' and many more. This concert will feature stunning visual effects, confetti cannons, and the famous Xylobands that light up in sync with the music.",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
      },
      {
        id: 12,
        name: "Book Fair",
        venue: "Delhi Pragati Maidan",
        date: "12 Dec",
        price: "5500",
        duration: "3 Hours",
        time: "7:00 PM Onwards",
        agelimit: "12+",
        about:
          "Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Experience the band's greatest hits including 'Yellow', 'Paradise', 'Viva La Vida' and many more. This concert will feature stunning visual effects, confetti cannons, and the famous Xylobands that light up in sync with the music.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      },
      {
        id: 13,
        name: "Sports Marathon",
        venue: "Mumbai Marine Drive",
        date: "15 Dec",
        price: "5500",
        duration: "3 Hours",
        time: "7:00 PM Onwards",
        agelimit: "12+",
        about:
          "Coldplay is performing live in Mumbai! Join us for a magical night filled with lights and music. Experience the band's greatest hits including 'Yellow', 'Paradise', 'Viva La Vida' and many more. This concert will feature stunning visual effects, confetti cannons, and the famous Xylobands that light up in sync with the music.",
        image: "https://wallpapercave.com/wp/wp2042626.jpg",
      },
    ],
  },
};
const API_BASE_URL = "http://localhost:9192/api/events";
class EventsService {


  // Trending events for Carousel Fetching and events section
  //   static async getTrendingEvents() {
  //   const response = await fetch(`${API_BASE_URL}/trending`);
  //   if (!response.ok) {
  //     throw new Error("Failed to fetch trending events");
      
  //   }
  //   return response.json();
  // }
  static async getTrendingEvents() {
  try {
    const response = await fetch(`${API_BASE_URL}/trending`);
    if (!response.ok) {
      throw new Error("Failed to fetch trending events");
    }
    const data = await response.json();

    // // Filter only UPCOMING events
    const upcomingEvents = data.filter(event => 
      event.status === 'UPCOMING' || event.status === 'upcoming'
    );
    return upcomingEvents.map(event => ({
      ...event,
      id: event.eventId || event.id
    }));
    
    // Map eventId to id for each event
    return data.map(event => ({
      ...event,
      id: event.eventId || event.id
    }));
  } catch (error) {
    console.error("Error fetching trending events:", error);
    throw error;
  }
}

  // Get events by category - comment it when we are fetching from backend
  // static async getEventsByCategory(category) {
  //   // Simulate API delay
  //   await new Promise((resolve) => setTimeout(resolve, 100));

  //   // In production, replace with:
  //   // const response = await fetch(`${API_BASE_URL}/events/${category}`);
  //   // return response.json();

  //   return eventsDatabase[category]?.events || [];
  // }
  
  // Get events by category - Uncomment it when backend is ready
  // static async getEventsByCategory(category) {
  //   // Special handling for trending
  //   if (category === 'trending') {
  //     return this.getTrendingEvents();
  //   }
    
  //   const response = await fetch(`${API_BASE_URL}/category/${category}`);
  //   if (!response.ok) {
  //     throw new Error(`Failed to fetch ${category} events`);
  //   }
  //   return response.json();
  // }
  static async getEventsByCategory(category) {
  if (category === 'trending') {
    return this.getTrendingEvents();
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/category/${category}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${category} events`);
    }
    const data = await response.json();

     // Filter only UPCOMING events
    const upcomingEvents = data.filter(event => 
      event.status === 'UPCOMING' || event.status === 'upcoming'
    );
    
    return upcomingEvents.map(event => ({
      ...event,
      id: event.eventId || event.id
    }));
    
    // Map eventId to id for each event
    return data.map(event => ({
      ...event,
      id: event.eventId || event.id
    }));
  } catch (error) {
    console.error(`Error fetching ${category} events:`, error);
    throw error;
  }
}

  // Get all categories with their events
  static async getAllCategories() {
    // In production, replace with:
    // const response = await fetch(`${API_BASE_URL}/events/categories`);
    // return response.json();

    return Object.entries(eventsDatabase).map(([key, value]) => ({
      key,
      title: value.title,
      icon: value.icon,
      events: value.events,
    }));
  }

   // ✅ Fetch all events
  //   static async getAllEvents() {
  //   const response = await fetch(`${API_BASE_URL}`);
  //   if (!response.ok) {
  //     throw new Error("Failed to fetch events");
  //   }
  //   return response.json();
  // }

  // Get category metadata (title, icon)
  // static getCategoryMeta(category) {
  //   const data = eventsDatabase[category];
  //   return {
  //     title: data?.title || "Events",
  //     icon: data?.icon || TrendingUp,
  //   };
  // }
  static getCategoryMeta(category) {
  const categoryMetadata = {
    trending: { title: "Trending Events", icon: TrendingUp },
    music: { title: "Music Events", icon: Music },
    recommended: { title: "You May Also Like", icon: Heart },
    plays: { title: "Theater & Plays", icon: Theater },
    standup: { title: "Stand-up Comedy", icon: Mic },
    art: { title: "Arts & Culture", icon: Palette },
    technology: { title: "Technology", icon: Palette },
    workshop: { title: "Workshops", icon: Palette },
  };

  return categoryMetadata[category] || {
    title: "Events",
    icon: TrendingUp,
  };
}

// Add this function in your EventsService class
static async getCities() {
  try {
    const response = await fetch(`${API_BASE_URL}/cities`);
    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return []; // Return empty array on error
  }
}


// Add this method to EventsService class
static async getEventsByCity(city) {
  try {
    const response = await fetch(`${API_BASE_URL}/city/${city}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch events for ${city}`);
    }
    const data = await response.json();

        // Filter only UPCOMING events
    const upcomingEvents = data.filter(event => 
      event.status === 'UPCOMING' || event.status === 'upcoming'
    );
    
    return upcomingEvents.map(event => ({
      ...event,
      id: event.eventId || event.id
    }));
    
    // Map eventId to id for consistency
    return data.map(event => ({
      ...event,
      id: event.eventId || event.id
    }));
  } catch (error) {
    console.error(`Error fetching ${city} events:`, error);
    throw error;
  }
}


  // // Get single event by ID-  comment it when we are fetching from backend
  // static async getEventById(id) {
  //   // In production: API call
  //   // const response = await fetch(`${API_BASE_URL}/${id}`);
  //   // if (!response.ok) {
  //   //   throw new Error("Failed to fetch event details");
  //   // }
  //   // return response.json();
  //   const allEvents = Object.values(eventsDatabase).flatMap(
  //     (category) => category.events
  //   );
  //   return allEvents.find((event) => event.id === parseInt(id));
  // }

  // Get event by id - uncomment it when backend is ready
  //   static async getEventById(id) {
  //   const response = await fetch(`${API_BASE_URL}/${id}`);
  //   if (!response.ok) {
  //     throw new Error("Failed to fetch event details");
  //   }
  //   return response.json();
  // }
  static async getEventById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch event details");
    }
    const data = await response.json();
    
    // Map eventId to id for consistency in frontend
    if (data.eventId && !data.id) {
      data.id = data.eventId;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw error;
  }
}



  // Get all events
  static async getAllEvents() {
    const response = await fetch(`${API_BASE_URL}`);
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    const data = await response.json();
  
  // Filter only UPCOMING events
  return data.filter(event => 
    event.status === 'UPCOMING' || event.status === 'upcoming'
  );

    return response.json();
  }

  // Search events
  static async searchEvents(query) {
    // In production: API call
    const allEvents = Object.values(eventsDatabase).flatMap(
      (category) => category.events
    );
    return allEvents.filter(
      (event) =>
        event.name.toLowerCase().includes(query.toLowerCase()) ||
        event.venue.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export default EventsService;