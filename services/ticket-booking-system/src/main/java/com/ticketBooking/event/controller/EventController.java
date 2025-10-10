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
