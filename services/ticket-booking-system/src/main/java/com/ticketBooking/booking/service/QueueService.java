package com.ticketBooking.booking.service;

import com.razorpay.Order;
import com.ticketBooking.booking.model.Booking;
import com.ticketBooking.booking.model.EventQueue;
import com.ticketBooking.booking.repository.BookingRepository;
import com.ticketBooking.booking.repository.EventQueueRepository;
import com.ticketBooking.event.model.Event;
import com.ticketBooking.event.repository.EventRepository;
import com.ticketBooking.user.model.User;
import com.ticketBooking.user.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class QueueService {

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final EventQueueRepository queueRepository;
    private final PaymentService paymentService;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    public QueueService(EventRepository eventRepository,
            BookingRepository bookingRepository,
            EventQueueRepository queueRepository,
            PaymentService paymentService,
            UserRepository userRepository,
            JavaMailSender mailSender) {
        this.eventRepository = eventRepository;
        this.bookingRepository = bookingRepository;
        this.queueRepository = queueRepository;
        this.paymentService = paymentService;
        this.userRepository = userRepository;
        this.mailSender = mailSender;
    }

    /**
     * Join queue or book directly (stores userEmail in queue row).
     * Accepts email (frontend must send it) and uses userRepository.findByEmail
     */
    @Transactional
    public EventQueue joinQueue(UUID eventId, String email, int amount) throws Exception {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        // Create Razorpay order
        Order order = paymentService.createOrder(amount);
        String orderId = order.get("id");

        // Create booking (initially pending)
        Booking booking = Booking.builder()
                .bookingId(UUID.randomUUID())
                .eventId(eventId)
                .userId(user.getId())
                .amount(amount)
                .orderId(orderId)
                .status("PENDING")
                .createdAt(java.time.LocalDateTime.now())
                .build();
        bookingRepository.save(booking);

        // Prepare queue entry
        EventQueue queueEntry = new EventQueue();
        queueEntry.setQueueId(UUID.randomUUID());
        queueEntry.setBookingId(booking.getBookingId());
        queueEntry.setEventId(eventId);
        queueEntry.setUserId(user.getId());
        queueEntry.setUserEmail(email);
        queueEntry.setOrderId(orderId);
        queueEntry.setCreatedAt(Instant.now());

        // ATOMIC check for direct booking
        int dec = eventRepository.decrementAvailableSlotsIfPresent(eventId);
        System.out.println("[joinQueue] decrementAvailableSlotsIfPresent returned " + dec);

        if (dec == 1) {
            // Slot was successfully reserved
            booking.setStatus("CONFIRMED");
            bookingRepository.save(booking);

            queueEntry.setStatus("BOOKED");
            queueEntry.setPosition(0);
            queueRepository.save(queueEntry);

            sendEmail(email, "Booking Confirmed - " + event.getName(),
                    "Your booking is confirmed.\nBooking ID: " + booking.getBookingId());
        } else {
            // No slot available → add to queue
            long waiting = queueRepository.countByEventIdAndStatus(eventId, "WAITING");
            int pos = (int) waiting + 1;

            queueEntry.setStatus("WAITING");
            queueEntry.setPosition(pos);
            queueRepository.save(queueEntry);

            sendEmail(email, "Added to Queue - " + event.getName(),
                    "You were added to the waiting list.\nPosition #" + pos);
        }

        return queueEntry;
    }

    /**
     * Cancel queue booking by email (for WAITING user) - no findById used.
     */
    @Transactional
    public void cancelQueueBooking(UUID eventId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        Optional<EventQueue> qOpt = queueRepository.findByEventIdAndUserEmail(eventId, email);
        if (qOpt.isEmpty())
            throw new RuntimeException("No queue entry found for user");

        EventQueue queue = qOpt.get();
        if (!"WAITING".equalsIgnoreCase(queue.getStatus())) {
            throw new RuntimeException("Only waiting entries can be cancelled via this endpoint");
        }

        Booking booking = bookingRepository.findById(queue.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking linked to queue not found"));

        queueRepository.delete(queue);
        bookingRepository.delete(booking);

        sendEmail(email, "Queue Cancelled", "You have been removed from the waiting list for event " + eventId);
        reindexQueuePositions(eventId);
    }

    /**
     * Auto-book next waiting user (called from BookingCancelService after confirmed
     * cancellation).
     * Uses email stored in EventQueue and findByEmail.
     */
    @Transactional
    public void autoBookNextUser(UUID eventId) {
        Optional<EventQueue> nextOpt = queueRepository.findFirstByEventIdAndStatusOrderByPositionAsc(eventId,
                "WAITING");
        if (nextOpt.isEmpty()) {
            System.out.println("[autoBookNextUser] no waiting user for " + eventId);
            return;
        }

        EventQueue next = nextOpt.get();
        System.out.println("[autoBookNextUser] attempting to auto-book queueId=" + next.getQueueId() + " bookingId="
                + next.getBookingId());

        // Try to atomically decrement the available slot that the cancel incremented
        int dec = eventRepository.decrementAvailableSlotsIfPresent(eventId);
        System.out.println(
                "[autoBookNextUser] decrementAvailableSlotsIfPresent returned " + dec + " for event " + eventId);

        if (dec != 1) {
            // Could not reserve slot — leave user WAITING (log and return)
            System.out.println("[autoBookNextUser] could not reserve slot for queueId=" + next.getQueueId()
                    + " — leaving WAITING");
            return;
        }

        // Now slot is reserved for this queued user — confirm booking
        Booking pendingBooking = bookingRepository.findById(next.getBookingId())
                .orElseThrow(() -> new RuntimeException("Linked booking not found: " + next.getBookingId()));

        pendingBooking.setStatus("CONFIRMED");
        bookingRepository.save(pendingBooking);

        next.setStatus("BOOKED");
        next.setPosition(0);
        queueRepository.save(next);

        // notify
        String userEmail = next.getUserEmail();
        sendEmail(userEmail, "Auto-booked for " + pendingBooking.getEventId(),
                "You have been auto-booked. Booking ID: " + pendingBooking.getBookingId());

        reindexQueuePositions(eventId);
        System.out.println("[autoBookNextUser] auto-book successful for queueId=" + next.getQueueId());
    }

    @Transactional
    public void reindexQueuePositions(UUID eventId) {
        List<EventQueue> waiting = queueRepository.findByEventIdAndStatusOrderByCreatedAtAsc(eventId, "WAITING");
        int pos = 1;
        for (EventQueue q : waiting) {
            q.setPosition(pos++);
            queueRepository.save(q);
        }
    }

    public int getQueuePosition(UUID eventId, String email) {
        Optional<EventQueue> opt = queueRepository.findByEventIdAndUserEmail(eventId, email);
        return opt.map(EventQueue::getPosition).orElse(-1);
    }

    private void sendEmail(String to, String subject, String body) {
        if (to == null || to.isBlank())
            return;
        try {
            SimpleMailMessage m = new SimpleMailMessage();
            m.setTo(to);
            m.setSubject(subject);
            m.setText(body);
            mailSender.send(m);
        } catch (Exception ex) {
            System.err.println("Failed to send email: " + ex.getMessage());
        }
    }
}
