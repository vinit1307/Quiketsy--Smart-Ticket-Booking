// hooks/useRecommendations.js
import { useState, useEffect } from 'react';

export const useRecommendations = (userId) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Get recommendations from FastAPI
        const recommendResponse = await fetch(`http://localhost:8000/recommend/${userId}`);
        
        if (!recommendResponse.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        
        const data = await recommendResponse.json();
        const { recommendation } = data;
        
        if (!recommendation || !recommendation.event_id) {
          setRecommendations([]);
          return;
        }

        // Create array of event data with IDs and basic info
        const indices = Object.keys(recommendation.event_id);
        const eventRequests = indices.map(index => ({
          eventId: recommendation.event_id[index],
          name: recommendation.name[index],
          category: recommendation.category[index],
          tags: recommendation.tags[index],
          index: index
        }));

        // Fetch all event details in parallel with better error handling
        const fullEventDetails = await Promise.allSettled(
          eventRequests.map(async (eventData) => {
            try {
              const response = await fetch(`http://localhost:9192/api/events/${eventData.eventId}`);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const fullData = await response.json();
              return fullData;
            } catch (error) {
              console.warn(`Failed to fetch full details for event ${eventData.eventId}, using partial data:`, error);
              // Return partial data from recommendation API
              return {
                eventId: eventData.eventId,
                name: eventData.name,
                category: eventData.category,
                tags: eventData.tags,
                venue: 'Venue TBA',
                eventDate: 'Date TBA',
                imageUrl: 'https://via.placeholder.com/400x300?text=Event+Image',
                ticketPrice: 'Price TBA',
                description: '',
                startTime: '',
                duration: '',
                ageLimit: '',
                status: 'UPCOMING'
              };
            }
          })
        );

        // Filter out completely failed requests and extract successful results
        const successfulEvents = fullEventDetails
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value);

        // Transform to format EventsSection expects
        const transformedData = successfulEvents.map(event => ({
          id: event.eventId,
          eventId: event.eventId,
          name: event.name,
          venue: event.venue || 'Venue TBA',
          eventDate: event.eventDate || 'Date TBA',
          date: event.eventDate || 'Date TBA',
          imageUrl: event.imageUrl || '',
          image: event.imageUrl || '',
          ticketPrice: event.ticketPrice || 'Price TBA',
          price: event.ticketPrice || 'Price TBA',
          duration: event.duration || '',
          startTime: event.startTime || '',
          time: event.startTime || '',
          ageLimit: event.ageLimit || '',
          description: event.description || '',
          about: event.description || '',
          category: event.category,
          tags: event.tags,
          city: event.city || '',
          language: event.language || '',
          totalSlots: event.totalSlots || 0,
          availableSlots: event.availableSlots || 0,
          status: event.status || 'UPCOMING',
          isTrending: event.isTrending || false,
          organizerId: event.organizerId || null
        }));

        setRecommendations(transformedData);
      } catch (err) {
        setError(err.message);
        console.error('Error in recommendation flow:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  return { recommendations, loading, error };
};