package com.ticketBooking.event.controller;

import com.ticketBooking.event.model.Event;
import com.ticketBooking.event.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    @GetMapping("/trending")
    public ResponseEntity<List<Event>> getTrendingEvents() {
        List<Event> trendingEvents = eventRepository.findByIsTrendingTrue();
        return ResponseEntity.ok(trendingEvents);
    }
}
