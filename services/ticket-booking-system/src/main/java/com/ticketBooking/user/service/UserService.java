package com.ticketBooking.user.service;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ticketBooking.user.dto.ChangePasswordRequest;
import com.ticketBooking.user.dto.UserDTO;
import com.ticketBooking.user.model.User;
import com.ticketBooking.user.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO getUserDetails(String email) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    return UserDTO.builder()
            .name(user.getName() != null ? user.getName() : "")
            .email(user.getEmail() != null ? user.getEmail() : "")
            .phoneNumber(user.getPhone() != null ? user.getPhone() : "")
            .dob(user.getDob() != null ? user.getDob().toString() : "")
            .role(user.getRole() != null ? user.getRole() : "USER")
            .build();
}


    public ResponseEntity<?> changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("New password and confirm password do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Password changed successfully");
    }
}
