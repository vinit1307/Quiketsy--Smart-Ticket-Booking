package com.ticketBooking.booking.controller;

import com.ticketBooking.booking.model.Booking;
import com.ticketBooking.booking.repository.BookingRepository;
import com.ticketBooking.booking.service.QRCodeGenerator;
import com.ticketBooking.event.model.Event;
import com.ticketBooking.event.repository.EventRepository;
import com.ticketBooking.user.model.User;
import com.ticketBooking.user.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    private RazorpayClient client;

    @Value("${RZP_KEY_ID}")
    private String razorpayKey;

    @Value("${RZP_KEY_SECRET}")
    private String razorpaySecret;

    @PostConstruct
    public void init() throws RazorpayException {
        client = new RazorpayClient(razorpayKey, razorpaySecret);
    }

    @GetMapping("/getKey")
    public ResponseEntity<?> getKey() {
        return ResponseEntity.ok(razorpayKey);
    }

    @PostMapping("/order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> data) {
        try {
            // 1️⃣ Get logged-in user email from JWT
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String email;

            if (principal instanceof String) {
                email = (String) principal;
            } else if (principal instanceof UserDetails) {
                email = ((UserDetails) principal).getUsername();
            } else {
                throw new RuntimeException("Cannot get email from SecurityContext");
            }

            // 2️⃣ Fetch User
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 3️⃣ Fetch Event
            UUID eventId = UUID.fromString(data.get("eventId").toString());
            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            // 3️⃣ Check available slots
            if (event.getAvailableSlots() == null || event.getAvailableSlots() <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "No slots available for this event"));
            }

            // 4️⃣ Parse amount safely
            // 4️⃣ Parse amount safely
            // 4️⃣ Parse amount safely from JSON
            Object amtObj = data.get("amount");
            int amount;

            if (amtObj instanceof Number) {
                // Works if JSON sends number (Integer, Double, etc.)
                amount = ((Number) amtObj).intValue();
            } else if (amtObj instanceof String) {
                // Works if JSON sends number as String
                amount = Integer.parseInt((String) amtObj);
            } else {
                throw new RuntimeException("Invalid amount format: " + amtObj);
            }

            // 5️⃣ Create Razorpay Order
            JSONObject options = new JSONObject();
            options.put("amount", amount * 100);
            options.put("currency", "INR");
            options.put("receipt", "txn_" + UUID.randomUUID());

            Order order = client.orders.create(options);

            // 6️⃣ Save booking
            Booking booking = new Booking();
            booking.setUserId(user.getId());
            booking.setEventId(event.getEventId());
            booking.setAmount(amount);
            booking.setOrderId(order.get("id"));
            booking.setStatus("PENDING");

            bookingRepository.save(booking);

            // 7️⃣ Decrement available slots immediately
            event.setAvailableSlots(event.getAvailableSlots() - 1);
            eventRepository.saveAndFlush(event);

            // 8️⃣ Return response
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.get("id"));
            response.put("amount", amount);
            response.put("currency", "INR");
            response.put("bookingId", booking.getBookingId());

            return ResponseEntity.ok(response);

        } catch (RazorpayException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestParam String orderId,
            @RequestParam String paymentId) {
        Booking booking = bookingRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setPaymentId(paymentId);
        booking.setStatus("CONFIRMED");

        // Generate QR code
        String qrText = "Booking ID: " + booking.getBookingId() +
                "\nEvent ID: " + booking.getEventId() +
                "\nUser ID: " + booking.getUserId();
        String qrBase64 = QRCodeGenerator.generateQRCodeBase64(qrText);
        booking.setQrCodeUrl(qrBase64);

        bookingRepository.save(booking);

        return ResponseEntity.ok(Map.of(
                "message", "Payment verified and booking confirmed",
                "bookingId", booking.getBookingId(),
                "qrCodeUrl", qrBase64));
    }
}
