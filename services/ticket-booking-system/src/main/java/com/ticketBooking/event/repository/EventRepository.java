package com.ticketBooking.event.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ticketBooking.event.model.Event;

import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
     List<Event> findByIsTrendingTrue();
     List<Event> findByCategory(String category);
     List<Event> findByOrganizerId(Integer organizerId);
     List<Event> findByCityIgnoreCase(String city);
     
     // ✅ NEW: Get all unique cities (for city dropdown/filter)
    @Query("SELECT DISTINCT e.city FROM Event e WHERE e.city IS NOT NULL ORDER BY e.city ASC")
    List<String> findAllUniqueCities();
    
    // ✅ NEW: Advanced search - searches in name, city, venue, category, tags
    @Query("SELECT e FROM Event e WHERE " +
           "LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.venue) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.tags) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Event> searchEvents(@Param("keyword") String keyword);
    
    // ✅ NEW: Search by name only (optional - for specific searches)
    List<Event> findByNameContainingIgnoreCase(String name);
    
    // ✅ NEW: Search by venue (optional)
    List<Event> findByVenueContainingIgnoreCase(String venue);
}