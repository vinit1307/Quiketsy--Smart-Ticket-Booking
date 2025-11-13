package com.ticketBooking.booking.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "event_queue")
public class EventQueue {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID queueId;

    @Column(name="booking_id",columnDefinition = "uuid",nullable = false)
    private UUID bookingId;

    @Column(name = "event_id",columnDefinition = "uuid", nullable = false)
    private UUID eventId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "user_email", length = 200)
    private String userEmail;

    @Column(name = "order_id")
    private String orderId;

    @Column(name = "position", nullable = false)
    private Integer position;

    @Column(nullable = false, length = 32)
    private String status; // WAITING, BOOKED, CANCELLED, FAILED

    @Column(name = "payment_id", length = 200)
    private String paymentId;

   @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist(){
        if (createdAt == null)
            createdAt = LocalDateTime.now();
    }

}