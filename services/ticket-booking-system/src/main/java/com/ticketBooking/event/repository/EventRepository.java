package com.ticketBooking.event.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ticketBooking.event.model.Event;

import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
}