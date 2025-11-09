package com.ticketBooking.booking.repository;

import com.ticketBooking.booking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByEventId(UUID eventId);
    long countByEventIdAndStatus(UUID eventId, String status);
    Optional<Booking> findByOrderId(String orderId);
    List<Booking> findByUserIdOrderByCreatedAtDesc(Integer id);


}
