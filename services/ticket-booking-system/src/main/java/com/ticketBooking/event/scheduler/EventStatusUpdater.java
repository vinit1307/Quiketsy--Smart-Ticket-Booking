package com.ticketBooking.event.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ticketBooking.event.model.Event;
import com.ticketBooking.event.repository.EventRepository;

import org.springframework.boot.context.event.ApplicationReadyEvent;

import java.time.LocalDate;
import java.util.List;

@Component
public class EventStatusUpdater {

    @Autowired
    private EventRepository eventRepository;

    // Runs when backend starts
    @EventListener(ApplicationReadyEvent.class)
    public void runAtStartup() {
        System.out.println("Running event status update at startup...");
        updateEventStatus();
    }

    // Optional: Runs daily at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    public void updateEventStatusScheduled() {
        System.out.println("Running scheduled event status update...");
        updateEventStatus();
    }

    private void updateEventStatus() {
        LocalDate today = LocalDate.now();
        List<Event> events = eventRepository.findAll();
        boolean updated = false;

        for (Event event : events) {
            if (event.getEventDate().isBefore(today) && !"COMPLETED".equalsIgnoreCase(event.getStatus())) {
                event.setStatus("COMPLETED");
                updated = true;
            }
        }

        if (updated) {
            eventRepository.saveAll(events);
            System.out.println("Event statuses updated successfully!");
        } else {
            System.out.println("No event statuses needed updating.");
        }
    }
}
