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
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Order order = paymentService.createOrder(amount);
        String orderId = order.get("id");

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

        EventQueue queueEntry = new EventQueue();
        queueEntry.setQueueId(UUID.randomUUID());
        queueEntry.setBookingId(booking.getBookingId());
        queueEntry.setEventId(eventId);
        queueEntry.setUserId(user.getId());
        queueEntry.setUserEmail(email);              // <-- store email here
        queueEntry.setOrderId(orderId);
        queueEntry.setPaymentId(null);
        queueEntry.setCreatedAt(Instant.now());

        if (event.getAvailableSlots() != null && event.getAvailableSlots() > 0) {
            booking.setStatus("CONFIRMED");
            bookingRepository.save(booking);

            event.setAvailableSlots(event.getAvailableSlots() - 1);
            eventRepository.save(event);

            queueEntry.setStatus("BOOKED");
            queueEntry.setPosition(0);
            queueRepository.save(queueEntry);

            sendEmail(email, "Booking Confirmed - " + event.getName(),
                    "✅ Your booking is confirmed.\nBooking ID: " + booking.getBookingId());
        } else {
            long waitingCount = queueRepository.countByEventIdAndStatus(eventId, "WAITING");
            int position = (int) waitingCount + 1;

            queueEntry.setStatus("WAITING");
            queueEntry.setPosition(position);
            queueRepository.save(queueEntry);

            sendEmail(email, "Added to Queue - " + event.getName(),
                    "⏳ You’ve been added to the waiting list. Position: #" + position);
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
        if (qOpt.isEmpty()) throw new RuntimeException("No queue entry found for user");

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
     * Auto-book next waiting user (called from BookingCancelService after confirmed cancellation).
     * Uses email stored in EventQueue and findByEmail.
     */
    @Transactional
    public void autoBookNextUser(UUID eventId) {
        Optional<EventQueue> nextOpt =
                queueRepository.findFirstByEventIdAndStatusOrderByPositionAsc(eventId, "WAITING");
        if (nextOpt.isEmpty()) return;

        EventQueue next = nextOpt.get();

        Booking pendingBooking = bookingRepository.findById(next.getBookingId())
                .orElseThrow(() -> new RuntimeException("Linked booking not found: " + next.getBookingId()));

        // 1) Confirm booking
        pendingBooking.setStatus("CONFIRMED");
        bookingRepository.save(pendingBooking);

        // 2) Update queue entry
        next.setStatus("BOOKED");
        next.setPosition(0);
        queueRepository.save(next);

        // 3) Update event slots (we assume the caller incremented slots already during cancel)
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        // Decrease slot because we assigned it to this user
        event.setAvailableSlots(Math.max(0, (event.getAvailableSlots() == null ? 0 : event.getAvailableSlots()) - 1));
        eventRepository.save(event);

        // 4) Use stored email (no findById)
        String userEmail = next.getUserEmail();
        if (userEmail == null || userEmail.isBlank()) {
            // fallback: try to find user by userId using findByEmail not available — but we assume email stored
            throw new RuntimeException("No userEmail stored in queue entry; joinQueue must store it");
        }

        // send notification
        sendEmail(userEmail, "Auto-booked for " + event.getName(),
                "🎉 A slot opened up and you have been auto-booked! Booking ID: " + pendingBooking.getBookingId());

        // 5) Reindex remaining queue
        reindexQueuePositions(eventId);
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
        if (to == null || to.isBlank()) return;
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
