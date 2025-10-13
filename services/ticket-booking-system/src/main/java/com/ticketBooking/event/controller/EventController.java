package com.ticketBooking.event.controller;

import com.ticketBooking.event.model.Event;
import com.ticketBooking.event.repository.EventRepository;
import com.ticketBooking.user.model.User;
import com.ticketBooking.user.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    // GET all events
    @GetMapping
    public List<Event> getAllEvents(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            return eventRepository.findByCategory(category);
        }
        return eventRepository.findAll();
    }
    @GetMapping("/trending")
    public ResponseEntity<List<Event>> getTrendingEvents() {
        List<Event> trendingEvents = eventRepository.findByIsTrendingTrue();
        return ResponseEntity.ok(trendingEvents);
    }


    // GET events by category (based on category column)
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Event>> getEventsByCategory(@PathVariable String category) {
        List<Event> events = eventRepository.findByCategory(category);
        return ResponseEntity.ok(events);
    }
    @PostMapping("/create")
public ResponseEntity<?> createEvent(@RequestBody Event event,
                                     @AuthenticationPrincipal String email) {
    User organizer = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!"ORGANIZER".equalsIgnoreCase(organizer.getRole())) {
        return ResponseEntity.status(403).body("Access denied: Only organizers can create events");
    }

    System.out.println(event);
    // Auto set organizerId
    event.setOrganizerId(organizer.getId());

    // Convert ageLimit like "12+" → 12
    if (event.getAgeLimit() != null) {
        String ageString = String.valueOf(event.getAgeLimit());
        if (ageString.endsWith("+")) {
            ageString = ageString.replace("+", "");
        }
        event.setAgeLimit(Integer.parseInt(ageString));
    }

    // Convert duration number → formatted string
    if (event.getDuration() != null && !event.getDuration().isEmpty()) {
        try {
            double durationValue = Double.parseDouble(event.getDuration());
            int hours = (int) durationValue;
            int minutes = (int) ((durationValue - hours) * 60);

            StringBuilder durationStr = new StringBuilder();
            if (hours > 0) {
                durationStr.append(hours).append(" hour");
                if (hours > 1) durationStr.append("s");
            }
            if (minutes > 0) {
                if (hours > 0) durationStr.append(" ");
                durationStr.append(minutes).append(" minute");
                if (minutes > 1) durationStr.append("s");
            }
            event.setDuration(durationStr.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid duration format");
        }
    }

    Event savedEvent = eventRepository.save(event);
    return ResponseEntity.ok(savedEvent);
}

   // ✅ Edit existing event (only organizer who created it)
   @PutMapping("/edit/{id}")
public ResponseEntity<?> editEvent(
        @PathVariable UUID id,
        @RequestBody Event updatedEvent,
        @AuthenticationPrincipal String email) {

    // Verify organizer
    User organizer = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!"ORGANIZER".equalsIgnoreCase(organizer.getRole())) {
        return ResponseEntity.status(403).body("Access denied: Only organizers can edit events");
    }

    // Find event
    Optional<Event> optionalEvent = eventRepository.findById(id);
    if (optionalEvent.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    Event existingEvent = optionalEvent.get();

    // Verify event ownership
    if (!existingEvent.getOrganizerId().equals(organizer.getId())) {
        return ResponseEntity.status(403).body("You can only edit your own events");
    }

    // ✅ Only update these editable fields if not null
    if (updatedEvent.getDescription() != null)
        existingEvent.setDescription(updatedEvent.getDescription());

    if (updatedEvent.getVenue() != null)
        existingEvent.setVenue(updatedEvent.getVenue());

    if (updatedEvent.getCity() != null)
        existingEvent.setCity(updatedEvent.getCity());

    if (updatedEvent.getEventDate() != null)
        existingEvent.setEventDate(updatedEvent.getEventDate());

    if (updatedEvent.getStartTime() != null)
        existingEvent.setStartTime(updatedEvent.getStartTime());

    if (updatedEvent.getDuration() != null)
        existingEvent.setDuration(updatedEvent.getDuration());

    if (updatedEvent.getTicketPrice() != null)
        existingEvent.setTicketPrice(updatedEvent.getTicketPrice());

   // System.out.println("updatedEvent" +updatedEvent.getAgeLimit());
    
   if (updatedEvent.getAgeLimit() != null){
        existingEvent.setAgeLimit(updatedEvent.getAgeLimit());
        if (existingEvent.getAgeLimit() != null) {
            String ageString = String.valueOf(existingEvent.getAgeLimit());
            if (ageString.endsWith("+")) {
                ageString = ageString.replace("+", "");
            }
            existingEvent.setAgeLimit(Integer.parseInt(ageString));
            System.out.println("existingEvent" +existingEvent.getAgeLimit());
        }
    }
    if (updatedEvent.getTotalSlots() != null)
        existingEvent.setTotalSlots(updatedEvent.getTotalSlots());

    if (updatedEvent.getImageUrl() != null)
        existingEvent.setImageUrl(updatedEvent.getImageUrl());

    Event savedEvent = eventRepository.save(existingEvent);
    return ResponseEntity.ok(savedEvent);
}

@PatchMapping("/cancel/{id}")
public ResponseEntity<?> cancelEvent(
        @PathVariable UUID id,
        @AuthenticationPrincipal String email) {

    User organizer = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!"ORGANIZER".equalsIgnoreCase(organizer.getRole())) {
        return ResponseEntity.status(403).body("Access denied: Only organizers can cancel events");
    }

    Optional<Event> optionalEvent = eventRepository.findById(id);
    if (optionalEvent.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    Event event = optionalEvent.get();

    if (!event.getOrganizerId().equals(organizer.getId())) {
        return ResponseEntity.status(403).body("You can only cancel your own events");
    }

    event.setStatus("CANCELLED");
    Event saved = eventRepository.save(event);

    return ResponseEntity.ok(saved);
}


@GetMapping("/organizer/{organizerId}")
public ResponseEntity<List<Event>> getEventsByOrganizer(@PathVariable Integer organizerId) {
    List<Event> events = eventRepository.findByOrganizerId(organizerId);
    return ResponseEntity.ok(events);
}



    // GET single event by ID
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable UUID id) {
        Optional<Event> event = eventRepository.findById(id);
        return event.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
