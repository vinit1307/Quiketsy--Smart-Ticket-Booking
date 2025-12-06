package com.ticketBooking.booking.repository;

import com.ticketBooking.booking.model.EventQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

    @Query(value = """
        SELECT position
        FROM event_queue
        WHERE queue_id = :queueId
          AND event_id = :eventId
          AND user_email = :email
        LIMIT 1
        """, nativeQuery = true)
    Integer getQueuePositionByEmail(UUID queueId, UUID eventId, String email);

    @Query(value = """
        SELECT COUNT(*)
        FROM event_queue
        WHERE event_id = :eventId
          AND position > 0
        """, nativeQuery = true)
    Integer countActiveQueueByEvent(UUID eventId);

}
