package com.ticketBooking.booking.repository;

import com.ticketBooking.booking.model.EventQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventQueueRepository extends JpaRepository<EventQueue, UUID> {
    Optional<EventQueue> findFirstByEventIdAndStatusOrderByPositionAsc(UUID eventId, String status);
    long countByEventIdAndStatus(UUID eventId, String status);
    List<EventQueue> findByEventIdAndStatusOrderByCreatedAtAsc(UUID eventId, String status);
    Optional<EventQueue> findByEventIdAndUserId(UUID eventId, Integer userId);
    Optional<EventQueue> findByEventIdAndUserEmail(UUID eventId, String email);
    void deleteByEventIdAndUserId(UUID eventId, Integer userId);
    void deleteByEventIdAndUserEmail(UUID eventId, String email);

    Optional<EventQueue> findByBookingId(UUID bookingId);
}
