package com.ticketBooking.event.controller;

import com.ticketBooking.booking.model.Booking;
import com.ticketBooking.booking.repository.BookingRepository;
import com.ticketBooking.event.model.Event;
import com.ticketBooking.event.repository.EventRepository;
import com.ticketBooking.event.services.EventService;
import com.ticketBooking.user.model.User;
import com.ticketBooking.user.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EventService eventService;

     // ✅ Get all unique cities (for dropdown)
    @GetMapping("/cities")
    public ResponseEntity<List<String>> getAllCities() {
        List<String> cities = eventService.getAllCities();
        return ResponseEntity.ok(cities);
    }

    // ✅ Get events by specific city
    @GetMapping("/city/{cityName}")
    public ResponseEntity<List<Event>> getEventsByCity(
            @PathVariable String cityName) {
        List<Event> events = eventService.getEventsByCity(cityName);
        return ResponseEntity.ok(events);
    }


    // ✅ GET all events (with optional category filter)
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents(
            @RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            return ResponseEntity.ok(eventService.getEventsByCategory(category));
        }
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // ✅ NAVBAR SEARCH - Main search endpoint
    // Searches in: event name, city, venue, category, tags
    @GetMapping("/search")
    public ResponseEntity<List<Event>> searchEvents(
            @RequestParam(required = false) String keyword) {
        
        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.ok(eventService.getAllEvents());
        }
        
        List<Event> events = eventService.searchEvents(keyword);
        return ResponseEntity.ok(events);
    }


    // ✅ Get trending events
    @GetMapping("/trending")
    public ResponseEntity<List<Event>> getTrendingEvents() {
        List<Event> trendingEvents = eventService.getTrendingEvents();
        return ResponseEntity.ok(trendingEvents);
    }


    // ✅ Get events by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Event>> getEventsByCategory(
            @PathVariable String category) {
        List<Event> events = eventService.getEventsByCategory(category);
        return ResponseEntity.ok(events);
    }


        // ✅ Search by name only (optional - specific search)
    @GetMapping("/search/name")
    public ResponseEntity<List<Event>> searchByName(
            @RequestParam String name) {
        List<Event> events = eventService.searchByName(name);
        return ResponseEntity.ok(events);
    }

    // ✅ Search by venue only (optional)
    @GetMapping("/search/venue")
    public ResponseEntity<List<Event>> searchByVenue(
            @RequestParam String venue) {
        List<Event> events = eventService.searchByVenue(venue);
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
    @Transactional
    public ResponseEntity<?> cancelEvent(
            @PathVariable("id") UUID eventId,
            @AuthenticationPrincipal String email) {

        // 1. Organizer from email
        User organizer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"ORGANIZER".equalsIgnoreCase(organizer.getRole())) {
            return ResponseEntity.status(403)
                    .body("Access denied: Only organizers can cancel events");
        }

        // 2. Event by ID
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // 3. Check ownership
        if (!organizer.getId().equals(event.getOrganizerId())) {
            return ResponseEntity.status(403)
                    .body("You can only cancel your own events");
        }

        // 4. If already cancelled
        if ("CANCELLED".equalsIgnoreCase(event.getStatus())) {
            return ResponseEntity.ok("Event already cancelled");
        }

        // 5. Cancel event
        event.setStatus("CANCELLED");
        eventRepository.save(event);

        // 6. Cancel bookings
        List<Booking> bookings = bookingRepository.findByEventId(event.getEventId());
        for (Booking booking : bookings) {
            booking.setStatus("CANCELLED");
        }
        bookingRepository.saveAll(bookings);

        // 7. Send email to each user
        for (Booking booking : bookings) {
            User user = userRepository
            .findById(booking.getUserId().longValue())
            .orElse(null);
    
            if (user == null) continue;
        
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(user.getEmail());
            msg.setSubject("Event Cancelled: " + event.getName());
            msg.setText(
                    "Dear " + user.getName() + ",\n\n" +
                    "We regret to inform you that the event \"" + event.getName() +
                    "\" has been cancelled by the organizer.\n\n" +
                    "Your ticket has been cancelled and the refund will be processed within 3-5 business days.\n\n" +
                    "Regards,\nQuiketsy-Ticket Booking"
            );
            mailSender.send(msg);
        }
        
        return ResponseEntity.ok("Event and all related bookings cancelled. Users notified by email.");
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
