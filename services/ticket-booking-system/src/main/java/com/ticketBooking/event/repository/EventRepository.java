package com.ticketBooking.event.repository;

import com.ticketBooking.event.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

       List<Event> findByIsTrendingTrue();

       List<Event> findByCategory(String category);

       List<Event> findByOrganizerId(Integer organizerId);

       List<Event> findByCityIgnoreCase(String city);

       // NEW: fetch single event with DB-level PESSIMISTIC WRITE lock
       @Lock(LockModeType.PESSIMISTIC_WRITE)
       @Query("SELECT e FROM Event e WHERE e.eventId = :id")
       Optional<Event> findByIdForUpdate(@Param("id") UUID id);

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

       @Modifying
       @Transactional
       @Query("UPDATE Event e SET e.availableSlots = COALESCE(e.availableSlots,0) + 1 WHERE e.eventId = :id")
       int incrementAvailableSlots(@Param("id") UUID id);

       @Modifying
       @Transactional
       @Query("UPDATE Event e SET e.availableSlots = e.availableSlots - 1 WHERE e.eventId = :id AND COALESCE(e.availableSlots,0) > 0")
       int decrementAvailableSlotsIfPresent(@Param("id") UUID id);

}
