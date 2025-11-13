package com.ticketBooking.booking.service;

import com.razorpay.Order;
import com.ticketBooking.booking.model.Booking;
import com.ticketBooking.booking.repository.BookingRepository;
import com.ticketBooking.booking.repository.EventQueueRepository;
import com.ticketBooking.event.model.Event;
import com.ticketBooking.event.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final PaymentService paymentService;
    private final EventQueueRepository eventQueueRepository;

    public Booking createBooking(UUID eventId, Integer userId) throws Exception {
        Optional<Event> eventOpt = eventRepository.findById(eventId);

        if (eventOpt.isEmpty()) {
            throw new RuntimeException("Event not found");
        }

        Event event = eventOpt.get();

        if (event.getAvailableSlots() <= 0) {
            throw new RuntimeException("No available slots for this event");
        }

        // Create Razorpay order
        Order order = paymentService.createOrder((int) event.getTicketPrice());

        // Save booking in DB with CREATED status
        Booking booking = Booking.builder()
                .bookingId(UUID.randomUUID())
                .eventId(eventId)
                .userId(userId)
                .orderId(order.get("id"))
                .status("CREATED")
                .build();

        bookingRepository.save(booking);

        return booking;
    }

    /**
     * Confirm payment for a direct booking (legacy flow).
     * This method will attempt to decrement the available slots atomically
     * and only then mark booking CONFIRMED and generate QR.
     */
    @Transactional
    public Booking confirmPayment(UUID bookingId, String paymentId) throws Exception {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Save payment id and set PAID (will become CONFIRMED after slot decrement)
        booking.setPaymentId(paymentId);
        booking.setStatus("PAID");
        bookingRepository.save(booking);

        // Atomic decrement and confirm
        int dec = eventRepository.decrementAvailableSlotsIfPresent(booking.getEventId());
        if (dec != 1) {
            // No slots available -> caller should handle refund logic
            booking.setStatus("FAILED_NO_SLOTS");
            bookingRepository.save(booking);
            throw new RuntimeException("No slots available to confirm booking");
        }

        // Mark confirmed and generate QR
        booking.setStatus("CONFIRMED");

        String qrData = "Booking ID: " + booking.getBookingId() + "\nEvent ID: " + booking.getEventId();
        String qrCode = QRCodeGenerator.generateQRCodeBase64(qrData);
        booking.setQrCodeUrl(qrCode);
        booking.setQrPayload(qrData);

        Booking saved = bookingRepository.save(booking);

        // If this booking belongs to a queue entry, update its status as well
        eventQueueRepository.findByBookingId(booking.getBookingId()).ifPresent(q -> {
            q.setStatus("BOOKED");
            q.setPosition(0);
            eventQueueRepository.save(q);
        });

        return saved;
    }

    /**
     * Attempt to confirm booking by atomically decrementing event.availableSlots.
     * Returns true if confirmation succeeded (slot reserved and booking marked CONFIRMED).
     * Returns false if no slot was available (booking left as-is).
     *
     * This method is used by the universal /verify endpoint and by auto-book assignment.
     */
    @Transactional
    public boolean confirmBookingIfSlotAvailable(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // If already confirmed, nothing to do
        if ("CONFIRMED".equalsIgnoreCase(booking.getStatus())) {
            return true;
        }

        int updated = eventRepository.decrementAvailableSlotsIfPresent(booking.getEventId());
        if (updated == 1) {
            // success: mark booking confirmed + generate QR if missing
            booking.setStatus("CONFIRMED");

            if (booking.getQrCodeUrl() == null || booking.getQrPayload() == null) {
                String qrText = "Booking ID: " + booking.getBookingId()
                        + "\nEvent ID: " + booking.getEventId()
                        + "\nUser ID: " + booking.getUserId();
                String qrBase64 = QRCodeGenerator.generateQRCodeBase64(qrText);
                booking.setQrPayload(qrText);
                booking.setQrCodeUrl(qrBase64);
            }

            bookingRepository.save(booking);

            // Update related queue entry to BOOKED / ASSIGNED if exists
            eventQueueRepository.findByBookingId(booking.getBookingId()).ifPresent(q -> {
                q.setStatus("BOOKED");
                q.setPosition(0);
                eventQueueRepository.save(q);
            });

            return true;
        } else {
            // no slot available
            return false;
        }
    }
}
