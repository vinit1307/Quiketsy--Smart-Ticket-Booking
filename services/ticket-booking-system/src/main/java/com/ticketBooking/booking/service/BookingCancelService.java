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
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUserId().equals(user.getId()))
            throw new RuntimeException("Not your booking");
        if ("CANCELLED".equalsIgnoreCase(booking.getStatus()))
            return Map.of("status", "ALREADY_CANCELLED");

        if (Boolean.TRUE.equals(booking.getVerified()))
            throw new RuntimeException("Ticket verified - cannot cancel");

        // mark cancelled
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
        System.out.println("[cancelBooking] booking " + bookingId + " -> CANCELLED");

        UUID eventId = booking.getEventId();

        // ATOMIC increment: use repository method
        int inc = eventRepository.incrementAvailableSlots(eventId);
        System.out.println("[cancelBooking] incrementAvailableSlots returned " + inc + " for event " + eventId);

        // If increment didn't update (inc==0) it's still OK — we proceed to try
        // auto-book,
        // but log it so we can debug.
        try {
            // Call auto-book AFTER increment. autoBookNextUser will attempt atomic
            // decrement.
            queueService.autoBookNextUser(eventId);
        } catch (Exception ex) {
            System.err.println("[cancelBooking] autoBookNextUser threw: " + ex.getMessage());
            ex.printStackTrace();
        }

        // send email
        sendCancellationEmailSafe(user, eventRepository.findById(eventId).orElse(null), booking);

        return Map.of("status", "CANCELLED", "message", "Booking cancelled successfully");
    }

    private void sendCancellationEmailSafe(User user, Event event, Booking booking) {
        try {
            if (mailSender == null || user.getEmail() == null)
                return;

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
                    booking.getBookingId());

            helper.setText(body);
            mailSender.send(mime);
        } catch (Exception ignored) {
            /* don’t fail cancellation on email issue */ }
    }
}
