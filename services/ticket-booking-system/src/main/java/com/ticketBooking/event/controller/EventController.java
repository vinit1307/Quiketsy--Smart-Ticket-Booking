package com.ticketBooking.event.controller;

import com.ticketBooking.event.model.Event;
import com.ticketBooking.event.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    // GET all events
    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // GET event by ID
    @GetMapping("/{id}")
    public Event getEventById(@PathVariable String id) {
        return eventRepository.findById(UUID.fromString(id)).orElse(null);
    }
}
