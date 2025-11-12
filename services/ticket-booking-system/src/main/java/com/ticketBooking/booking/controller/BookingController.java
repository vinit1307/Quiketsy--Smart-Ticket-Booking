package com.ticketBooking.booking.controller;

import com.ticketBooking.booking.model.Booking;
import com.ticketBooking.booking.repository.BookingRepository;
import com.ticketBooking.booking.service.BookingCancelService;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
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
            // Get logged-in user email from JWT
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String email;

            if (principal instanceof String) {
                email = (String) principal;
            } else if (principal instanceof UserDetails) {
                email = ((UserDetails) principal).getUsername();
            } else {
                throw new RuntimeException("Cannot get email from SecurityContext");
            }

            // Fetch User
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Fetch Event
            UUID eventId = UUID.fromString(data.get("eventId").toString());
            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            // Check available slots
            // if (event.getAvailableSlots() == null || event.getAvailableSlots() <= 0) {
            //     return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            //             .body(Map.of("error", "No slots available for this event"));
            // }
            
            // Parse amount safely
            // Parse amount safely
            // Parse amount safely from JSON
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

            // Create Razorpay Order
            JSONObject options = new JSONObject();
            options.put("amount", amount * 100);
            options.put("currency", "INR");
            options.put("receipt", "txn_" + UUID.randomUUID());

            Order order = client.orders.create(options);

            // Save booking
            Booking booking = new Booking();
            booking.setUserId(user.getId());
            booking.setEventId(event.getEventId());
            booking.setAmount(amount);
            booking.setOrderId(order.get("id"));
            booking.setStatus("PENDING");

            bookingRepository.save(booking);

            // Decrement available slots immediately
            event.setAvailableSlots(event.getAvailableSlots() - 1);
            eventRepository.saveAndFlush(event);

            // Return response
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

        String qrText = "Booking ID: " + booking.getBookingId() +
                "\nEvent ID: " + booking.getEventId() +
                "\nUser ID: " + booking.getUserId();
        String qrBase64 = QRCodeGenerator.generateQRCodeBase64(qrText);

        booking.setQrPayload(qrText);
        booking.setQrCodeUrl(qrBase64);

        bookingRepository.save(booking);

        return ResponseEntity.ok(Map.of(
                "message", "Payment verified and booking confirmed",
                "bookingId", booking.getBookingId(),
                "qrCodeUrl", qrBase64));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getBookingHistory(Authentication auth) {
        try {
            // Get current user email from JWT
            String email = (auth.getPrincipal() instanceof UserDetails ud)
                    ? ud.getUsername()
                    : auth.getName();

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Get all bookings for this user
            List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

            // Build combined response from existing tables
            List<Map<String, Object>> response = new ArrayList<>();

            for (Booking b : bookings) {
                Event e = eventRepository.findById(b.getEventId()).orElse(null);

                if (e != null) {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("bookingId", b.getBookingId());
                    entry.put("status", b.getStatus());
                    entry.put("bookedOn", b.getCreatedAt());

                    entry.put("eventName", e.getName());
                    entry.put("photo", e.getImageUrl());
                    entry.put("category", e.getCategory());
                    entry.put("price", e.getTicketPrice());
                    entry.put("eventDate", e.getEventDate());
                    entry.put("time", e.getStartTime());
                    entry.put("venue", e.getVenue());
                    entry.put("city", e.getCity());
                    response.add(entry);
                }
            }
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/ticket/{bookingId}")
    public ResponseEntity<?> getTicketDetails(@PathVariable UUID bookingId, Authentication auth) {
        try {
            // Get user from JWT
            String email = (auth.getPrincipal() instanceof UserDetails ud)
                    ? ud.getUsername()
                    : auth.getName();

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Fetch booking and event
            Booking b = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            if (!b.getUserId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You are not authorized for this booking"));
            }

            Event e = eventRepository.findById(b.getEventId())
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            // Build the response directly
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("bookingId", b.getBookingId());
            response.put("orderId", b.getOrderId());
            response.put("paymentId", b.getPaymentId());
            response.put("qrCodeUrl", b.getQrCodeUrl());
            response.put("status", b.getStatus());
            response.put("bookedOn", b.getCreatedAt());
            response.put("price", e.getTicketPrice());

            // event details
            response.put("eventName", e.getName());
            response.put("photo", e.getImageUrl());
            response.put("category", e.getCategory());
            response.put("eventDate", e.getEventDate());
            response.put("time", e.getStartTime());
            response.put("venue", e.getVenue());
            response.put("city", e.getCity());
            response.put("duration", e.getDuration());
            response.put("language", e.getLanguage());
            response.put("age", e.getAgeLimit());

            // user details
            response.put("bookedByName", user.getName());
            response.put("bookedByEmail", user.getEmail());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify-ticket")
    @Transactional
    public ResponseEntity<?> verifyTicket(@RequestBody Map<String, String> req, Authentication auth) {
        try {
            UUID eventId = UUID.fromString(req.get("eventId"));
            String scanned = req.get("ticketHash"); // raw text from scanner

            if (scanned == null || scanned.isBlank()) {
                return ResponseEntity.ok(Map.of("status", "INVALID", "message", "Empty QR"));
            }

            // Extract bookingId & eventId from scanned text
            UUID bookingId = null, scannedEventId = null;
            for (String line : scanned.split("\\r?\\n")) {
                String t = line.trim();
                if (t.startsWith("Booking ID:"))
                    bookingId = UUID.fromString(t.substring(11).trim());
                else if (t.startsWith("Event ID:"))
                    scannedEventId = UUID.fromString(t.substring(9).trim());
            }

            if (bookingId == null || scannedEventId == null) {
                return ResponseEntity.ok(Map.of("status", "INVALID", "message", "QR parse failed"));
            }

            if (!eventId.equals(scannedEventId)) {
                return ResponseEntity.ok(Map.of("status", "INVALID", "message", "QR belongs to another event"));
            }

            Booking b = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            if (!b.getEventId().equals(eventId)) {
                return ResponseEntity.ok(Map.of("status", "INVALID", "message", "Booking/event mismatch"));
            }

            if (!"CONFIRMED".equalsIgnoreCase(b.getStatus())) {
                return ResponseEntity.ok(Map.of("status", "NOT_CONFIRMED", "message", "Booking not confirmed"));
            }

            // ✅ Handle null qrPayload for old bookings
            String expectedPayload = b.getQrPayload();
            if (expectedPayload == null || expectedPayload.isBlank()) {
                expectedPayload = "Booking ID: " + b.getBookingId() +
                        "\nEvent ID: " + b.getEventId() +
                        "\nUser ID: " + b.getUserId();

                // Optional: store it so it's filled for future scans
                b.setQrPayload(expectedPayload);
                bookingRepository.save(b);
            }

            // Compare scanned text with stored/reconstructed payload
            if (!scanned.trim().equals(expectedPayload.trim())) {
                return ResponseEntity.ok(Map.of("status", "INVALID", "message", "QR content mismatch"));
            }

            if (Boolean.TRUE.equals(b.getVerified())) {
                return ResponseEntity.ok(Map.of(
                        "status", "ALREADY_VERIFIED",
                        "message", "Ticket already scanned",
                        "verifiedAt", b.getVerifiedAt()));
            }

            b.setVerified(true);
            b.setVerifiedAt(LocalDateTime.now());
            bookingRepository.save(b);

            return ResponseEntity.ok(Map.of(
                    "status", "VERIFIED_OK",
                    "message", "Ticket verified successfully",
                    "data", Map.of("bookingId", b.getBookingId(), "verifiedAt", b.getVerifiedAt())));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of("status", "INVALID", "message", e.getMessage()));
        }
    }

    private final BookingCancelService cancelService;

    @PostMapping("/{bookingId}/cancel")
    public ResponseEntity<?> cancel(@PathVariable UUID bookingId, Authentication auth) {
        try {
            String email = (auth.getPrincipal() instanceof UserDetails ud)
                    ? ud.getUsername()
                    : auth.getName();

            Map<String, Object> result = cancelService.cancelBooking(bookingId, email);
            return ResponseEntity.ok(result);

        } catch (RuntimeException re) {
            return ResponseEntity.badRequest().body(Map.of("status", "ERROR", "message", re.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("status", "ERROR", "message", e.getMessage()));
        }
    }
}
