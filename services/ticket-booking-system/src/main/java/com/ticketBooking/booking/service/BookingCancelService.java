package com.ticketBooking.booking.service;

import java.util.Map;
import java.util.UUID;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.ticketBooking.booking.model.Booking;
import com.ticketBooking.booking.repository.BookingRepository;
import com.ticketBooking.event.model.Event;
import com.ticketBooking.event.repository.EventRepository;
import com.ticketBooking.user.model.User;
import com.ticketBooking.user.repository.UserRepository;

import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingCancelService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender; // if you don't want email now, you can remove this and the method below
    private final QueueService queueService;

    @Transactional
    public Map<String, Object> cancelBooking(UUID bookingId, String email) {
        // 1) who is cancelling
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        // 2) load booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUserId().equals(user.getId())) {
            throw new RuntimeException("Not your booking");
        }

        // already cancelled → idempotent
        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            return Map.of("status", "ALREADY_CANCELLED", "message", "Booking already cancelled");
        }

        // optional: disallow cancel if verified at gate
        if (Boolean.TRUE.equals(booking.getVerified())) {
            throw new RuntimeException("Ticket already verified at gate — cannot cancel");
        }

        // 3) load event
        Event event = eventRepository.findById(booking.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // 4) mark cancelled
        booking.setStatus("CANCELLED");   // <- plain string
        bookingRepository.save(booking);
        
        queueService.autoBookNextUser(booking.getEventId());


        // 5) increment available slots (avoid going over total)
        Integer slots = event.getAvailableSlots() == null ? 0 : event.getAvailableSlots();
        Integer total  = event.getTotalSlots() == null ? Integer.MAX_VALUE : event.getTotalSlots();
        int newSlots = Math.min(slots + 1, total);
        event.setAvailableSlots(newSlots);
        eventRepository.save(event);

        // 6) notify via email (optional)
        sendCancellationEmailSafe(user, event, booking);

        return Map.of("status", "CANCELLED", "message", "Booking cancelled successfully");
    }

    private void sendCancellationEmailSafe(User user, Event event, Booking booking) {
        try {
            if (mailSender == null || user.getEmail() == null) return;

            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true);

            helper.setTo(user.getEmail());
            helper.setSubject("Ticket Cancelled: " + event.getName());

            String body = """
                Hi %s,

                Your ticket has been CANCELLED for the event:
                Event: %s
                Date: %s   Time: %s
                Venue: %s, %s

                Booking ID: %s
                Status: CANCELLED

                Refund (if applicable) will be processed as per policy.

                Thank you.
                """.formatted(
                    user.getName() != null ? user.getName() : "there",
                    event.getName(),
                    event.getEventDate(), event.getStartTime(),
                    event.getVenue(), event.getCity(),
                    booking.getBookingId()
                );

            helper.setText(body);
            mailSender.send(mime);
        } catch (Exception ignored) { /* don’t fail cancellation on email issue */ }
    }
}

