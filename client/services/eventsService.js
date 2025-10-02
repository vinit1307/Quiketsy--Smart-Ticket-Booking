import { TrendingUp, Music, Heart } from "lucide-react";

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
    ]
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
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
      },
      {
        id: 8,
        name: "Classical Music Night",
        venue: "Chennai Auditorium",
        date: "20 Nov",
        image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae",
      },
      {
        id: 9,
        name: "EDM Party",
        venue: "Bangalore Club",
        date: "22 Nov",
        image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1",
      },
      {
        id: 10,
        name: "Jazz Evening",
        venue: "Mumbai Jazz Club",
        date: "25 Nov",
        image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f",
      },
    ]
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
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
      },
      {
        id: 12,
        name: "Book Fair",
        venue: "Delhi Pragati Maidan",
        date: "12 Dec",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      },
      {
        id: 13,
        name: "Sports Marathon",
        venue: "Mumbai Marine Drive",
        date: "15 Dec",
        image: "https://images.unsplash.com/photo-1513276193780-64d2b97b2a8f",
      },
    ]
  }
};

class EventsService {
  // Get events by category
  static async getEventsByCategory(category) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In production, replace with:
    // const response = await fetch(`${API_BASE_URL}/events/${category}`);
    // return response.json();
    
    return eventsDatabase[category]?.events || [];
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
      events: value.events
    }));
  }

  // Get category metadata (title, icon)
  static getCategoryMeta(category) {
    const data = eventsDatabase[category];
    return {
      title: data?.title || "Events",
      icon: data?.icon || TrendingUp
    };
  }

  // Get single event by ID
  static async getEventById(id) {
    // In production: API call
    const allEvents = Object.values(eventsDatabase)
      .flatMap(category => category.events);
    return allEvents.find(event => event.id === parseInt(id));
  }

  // Search events
  static async searchEvents(query) {
    // In production: API call
    const allEvents = Object.values(eventsDatabase)
      .flatMap(category => category.events);
    return allEvents.filter(event => 
      event.name.toLowerCase().includes(query.toLowerCase()) ||
      event.venue.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export default EventsService;