package com.ticketBooking.event.model;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @Column(name = "event_id", columnDefinition = "uuid")
    private UUID eventId;

    // if your users table uses integer PK, keep organizerId as Integer
    @Column(name = "organizer_id")
    private Integer organizerId;

    @Column(name = "is_trending")
@Builder.Default 
private Boolean isTrending = false;

    private String name;
    private String venue;
    private String city;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    // store PostgreSQL interval; Hibernate will use columnDefinition when creating schema
    @Column(name = "duration")
    private String duration; // e.g. "2 hours 30 minutes"

    @Column(name = "ticket_price")
    private Integer ticketPrice;

    @Column(name = "age_limit")
    private Integer ageLimit;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    private String language;

    @Column(name = "category")
    private String category;
    
    private String tags;

    @Column(name = "total_slots")
    private Integer totalSlots;

    @Column(name = "available_slots")
    private Integer availableSlots;

    @Column(name = "status")
    private String status;

    @PrePersist
    public void prePersist() {
        if (this.eventId == null) {
            this.eventId = UUID.randomUUID();       // Java-side UUID generation
        }
        if (this.availableSlots == null && this.totalSlots != null) {
            this.availableSlots = this.totalSlots;
        }
        if (this.isTrending == null) this.isTrending = false;
        if (this.status == null) this.status = "UPCOMING";
    }
}