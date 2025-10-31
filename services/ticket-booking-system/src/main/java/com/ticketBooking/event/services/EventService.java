package com.ticketBooking.event.services;

import com.ticketBooking.event.model.Event;
import com.ticketBooking.event.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    // Get all events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Get all unique cities
   public List<String> getAllCities() {
        return eventRepository.findAllUniqueCities();
    }

    // Get events by city
    public List<Event> getEventsByCity(String city) {
        if (city == null || city.trim().isEmpty()) {
            return getAllEvents(); // Return all if city is empty
        }
        String s1=city.toLowerCase();
        return eventRepository.findByCityIgnoreCase(s1);

    }

    // Get trending events
    public List<Event> getTrendingEvents() {
        return eventRepository.findByIsTrendingTrue();
    }

    // Get events by category
    public List<Event> getEventsByCategory(String category) {
        return eventRepository.findByCategory(category);
    }

     // ✅ NAVBAR SEARCH - Main search method
    // Searches in: name, city, venue, category, tags
    public List<Event> searchEvents(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllEvents(); // Return all if search is empty
        }
        return eventRepository.searchEvents(keyword.trim());
    }

    // Get event by ID
    public Event getEventById(UUID eventId) {
        return eventRepository.findById(eventId).orElse(null);
    }

    // Get events by organizer
    public List<Event> getEventsByOrganizer(Integer organizerId) {
        return eventRepository.findByOrganizerId(organizerId);
    }

    // ✅ Additional helper methods (optional)
    public List<Event> searchByName(String name) {
        return eventRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Event> searchByVenue(String venue) {
        return eventRepository.findByVenueContainingIgnoreCase(venue);
    }
}