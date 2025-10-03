package com.ticketBooking.user.controller;

import com.ticketBooking.security.JwtUtil;
import com.ticketBooking.user.dto.ChangePasswordRequest;
import com.ticketBooking.user.dto.LoginRequest;
import com.ticketBooking.user.dto.LoginResponse;
import com.ticketBooking.user.dto.RegisterRequest;
import com.ticketBooking.user.dto.UserDTO;
import com.ticketBooking.user.model.User;
import com.ticketBooking.user.repository.UserRepository;
import com.ticketBooking.user.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Make sure you have a bean for this

     @Autowired
    private UserService userService;

    // ---------- REGISTER ----------
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }
        if (!request.getPhone().matches("^[6-9]\\d{9}$")) {
            return ResponseEntity.badRequest().body("Error: Invalid phone number!");
        }
        if (request.getDob().isAfter(LocalDate.now())) {
            return ResponseEntity.badRequest().body("Error: Date of Birth cannot be in the future!");
        }

        User user = new User();
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPhone(request.getPhone());
    user.setDob(request.getDob()); // if dob is sent as string
    user.setPassword(passwordEncoder.encode(request.getPassword())); // ✅ encrypt once

    // Set role and dateJoined if needed
    user.setRole(request.getRole() != null ? request.getRole().toUpperCase() : "USER");
    user.setDateJoined(LocalDateTime.now());

    userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    // ---------- LOGIN ----------
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body("Error: User not found");
        }

        User user = userOptional.get();

        // Match raw password with encrypted one
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Error: Invalid credentials");
        }

        String jwtToken = jwtUtil.generateToken(user.getEmail());

        return ResponseEntity.ok(new LoginResponse(jwtToken, user.getName(), user.getRole()));
    }

    @GetMapping("/user/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer "
            String email = jwtUtil.extractEmail(token);

            UserDTO userDTO = userService.getUserDetails(email);

            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error: Unauthorized");
        }
    }
    @PostMapping("/user/change-password")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String authHeader,
                                            @RequestBody ChangePasswordRequest request) {
        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);

            return userService.changePassword(email, request);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error: Unauthorized");
        }
    }
}
