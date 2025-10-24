package com.ticketBooking.event.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ticketBooking.event.model.Event;

import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
     List<Event> findByIsTrendingTrue();
     List<Event> findByCategory(String category);
     List<Event> findByOrganizerId(Integer organizerId);

     //@Query("SELECT DISTINCT e.city FROM Event e ORDER BY e.city ASC")
    //List<String> findAllUniqueCities();

    //List<Event> findByCity(String city);
    List<Event> findByCityIgnoreCase(String city);
    //List<Event> searchEvents(String keyword);
}