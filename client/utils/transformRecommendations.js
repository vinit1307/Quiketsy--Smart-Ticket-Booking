// utils/transformRecommendations.js
export const transformRecommendations = (apiResponse) => {
  const { recommendation } = apiResponse;
  
  if (!recommendation) return [];
  
  // Get the keys (indices) from any of the nested objects
  const indices = Object.keys(recommendation.event_id || {});
  
  // Transform the data into the format EventsSection expects
  return indices.map(index => ({
    id: recommendation.event_id[index],
    eventId: recommendation.event_id[index],
    name: recommendation.name[index],
    category: recommendation.category[index],
    tags: recommendation.tags[index],
    // Add default values for missing fields that EventsSection might need
    venue: recommendation.venue?.[index] || 'Venue TBA',
    eventDate: recommendation.date?.[index] || 'Date TBA',
    imageUrl: recommendation.image?.[index] || '', // You'll need to get this from somewhere
    ticketPrice: recommendation.price?.[index] || 'Price TBA',
    duration: recommendation.duration?.[index] || '',
    startTime: recommendation.time?.[index] || '',
    ageLimit: recommendation.ageLimit?.[index] || '',
    description: recommendation.description?.[index] || ''
  }));
};