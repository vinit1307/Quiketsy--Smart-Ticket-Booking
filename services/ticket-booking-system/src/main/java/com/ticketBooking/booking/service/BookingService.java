package com.ticketBooking.booking.service;

import com.ticketBooking.booking.model.Booking;
import com.ticketBooking.booking.repository.BookingRepository;
import com.ticketBooking.event.model.Event;
import com.ticketBooking.event.repository.EventRepository;
import com.razorpay.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final PaymentService paymentService;

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
                .eventId(eventId)
                .userId(userId)
                .orderId(order.get("id"))
                .status("CREATED")
                .build();

        bookingRepository.save(booking);

        return booking;
    }

    public Booking confirmPayment(UUID bookingId, String paymentId) throws Exception {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setPaymentId(paymentId);
        booking.setStatus("PAID");

        // Generate QR Code for booking using static method
        String qrData = "Booking ID: " + booking.getBookingId() + "\nEvent ID: " + booking.getEventId();
        String qrCode = QRCodeGenerator.generateQRCodeBase64(qrData);
        booking.setQrCodeUrl(qrCode);

        // Reduce event slot by 1
        Event event = eventRepository.findById(booking.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setAvailableSlots(event.getAvailableSlots() - 1);
        eventRepository.save(event);

        return bookingRepository.save(booking);
    }
}
