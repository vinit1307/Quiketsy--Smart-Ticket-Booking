package com.ticketBooking.user.controller;

import com.ticketBooking.user.dto.ForgotPasswordRequest;
import com.ticketBooking.user.model.User;
import com.ticketBooking.user.repository.UserRepository;
import com.ticketBooking.user.service.EmailService;
import com.ticketBooking.user.service.OTPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class ForgotPasswordController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OTPService otpService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Step 1: Send OTP
    @PostMapping("/sendOtp")
    public ResponseEntity<String> sendOTP(@RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null)
            return ResponseEntity.badRequest().body("User not found");

        String otp = otpService.generateOTP(email);
        emailService.sendEmail(email, "Password Reset OTP", "Your OTP is: " + otp + " OTP is Valid for Only 5 Minutes");

        return ResponseEntity.ok("OTP sent to your email");
    }

    // Step 2: Validate OTP
    @PostMapping("/validate-otp")
    public ResponseEntity<String> validateOTP(@RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail();
        String otp = request.getOtp(); // make sure your DTO has an otp field

        if (otpService.validateOTP(email, otp)) {
            otpService.clearOTP(email);
            return ResponseEntity.ok("OTP validated");
        }
        return ResponseEntity.badRequest().body("Invalid OTP");
    }

    // Step 3: Reset Password
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail();
        String newPassword = request.getNewPassword(); // make sure your DTO has this field

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }

}
