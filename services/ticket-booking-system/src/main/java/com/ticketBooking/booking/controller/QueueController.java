package com.ticketBooking.booking.controller;

import com.ticketBooking.booking.model.EventQueue;
import com.ticketBooking.booking.repository.EventQueueRepository;
import com.ticketBooking.booking.service.QueueService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Auth-aware QueueController.
 *
 * - Uses the authenticated principal's email (from JWT) for all
 * user-identifying actions.
 * - Prevents passing arbitrary emails in body to act for another user.
 */
@RestController
@RequestMapping("/api/events")
public class QueueController {

    private final QueueService queueService;

    public QueueController(QueueService queueService) {
        this.queueService = queueService;
    }

    /**
     * Join queue (or book immediately if slots available).
     * Uses the authenticated user's email from the SecurityContext.
     *
     * Body:
     * { "amount": 500 }
     */
    @PostMapping("/join/{eventId}")
    public ResponseEntity<?> joinQueue(
            @PathVariable UUID eventId,
            @RequestBody JoinQueueRequest request,
            Authentication auth) {
        try {
            String email = getEmailFromAuth(auth);
            int amount = request.getAmount();

            EventQueue queueEntry = queueService.joinQueue(eventId, email, amount);

            // Build response with both "order-style" fields and existing queue fields
            Map<String, Object> resp = new HashMap<>();
            // order-style fields (same as createOrder response)
            resp.put("orderId", queueEntry.getOrderId());
            resp.put("amount", amount);
            resp.put("currency", "INR");
            resp.put("bookingId", queueEntry.getBookingId());

            // existing queue response fields (keep for backward compatibility)
            resp.put("message", "Queue joined successfully");
            resp.put("queueStatus", queueEntry.getStatus());
            resp.put("position", queueEntry.getPosition());
            resp.put("queueId", queueEntry.getQueueId());

            // (optional) include a nested queue object for convenience (frontend can
            // ignore)
            Map<String, Object> queueMeta = new HashMap<>();
            queueMeta.put("queueId", queueEntry.getQueueId());
            queueMeta.put("position", queueEntry.getPosition());
            queueMeta.put("status", queueEntry.getStatus());
            resp.put("queue", queueMeta);

            return ResponseEntity.ok(resp);
        } catch (RuntimeException re) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "ERROR", "message", re.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "ERROR", "message", e.getMessage()));
        }
    }

    /**
     * Cancel queue booking for the authenticated user (only queued/waiting
     * entries).
     *
     * Body: empty or { } — we use auth email
     */
    @PostMapping("/cancel/{eventId}")
    public ResponseEntity<?> cancelQueue(
            @PathVariable UUID eventId,
            Authentication auth) {
        try {
            String email = getEmailFromAuth(auth);
            queueService.cancelQueueBooking(eventId, email);
            return ResponseEntity.ok(Map.of("message", "Queue booking cancelled successfully"));
        } catch (RuntimeException re) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "ERROR", "message", re.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "ERROR", "message", e.getMessage()));
        }
    }

    /**
     * Get queue position for the authenticated user.
     * Example: GET /api/events/{eventId}/queue-position
     */
    @Autowired
    private EventQueueRepository eventQueueRepository;

    @GetMapping("/{orderId}/queue/{eventId}/position")
    public ResponseEntity<?> getQueuePosition(
            @PathVariable("orderId") String orderId,
            @PathVariable("eventId") UUID eventId,
            Authentication authentication) {

        // Email/username from JWT
        String email = authentication.getName();
        System.out.println("Authenticated email: " + email);

        // Fetch queue position for this event + this queue entry + this user
        Integer position = eventQueueRepository.getQueuePositionByEmail(
                orderId,
                eventId,
                email);

        // If no row found, treat as 0 (not in this queue)
        if (position == null) {
            position = 0;
        }

        // You can also return queueId so frontend knows which entry is being shown
        return ResponseEntity.ok(
                Map.of(
                        "orderId", orderId,
                        "position", position));
    }

    @GetMapping("/{eventId}/queue-count")
    public ResponseEntity<?> getQueueCount(@PathVariable UUID eventId) {

        Integer count = eventQueueRepository.countActiveQueueByEvent(eventId);

        if (count == null) {
            count = 0;
        }

        // we just wanted “how many users are in queue”
        return ResponseEntity.ok(Map.of("count", count));
    }

    /* -------------------- Helpers & DTOs -------------------- */

    private String getEmailFromAuth(Authentication auth) {
        if (auth == null)
            throw new RuntimeException("Authentication required");
        Object principal = auth.getPrincipal();
        if (principal instanceof String) {
            return (String) principal;
        } else if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return auth.getName();
        }
    }

    public static class JoinQueueRequest {
        private int amount;

        public int getAmount() {
            return amount;
        }

        public void setAmount(int amount) {
            this.amount = amount;
        }
    }
}
