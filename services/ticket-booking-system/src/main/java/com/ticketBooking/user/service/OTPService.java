package com.ticketBooking.user.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OTPService {

    private static final long OTP_VALID_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

    private static class OTPDetails {
        String otp;
        long timestamp;

        OTPDetails(String otp, long timestamp) {
            this.otp = otp;
            this.timestamp = timestamp;
        }
    }

    private Map<String, OTPDetails> otpStorage = new HashMap<>();

    // Generate and store OTP
    public String generateOTP(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStorage.put(email, new OTPDetails(otp, Instant.now().toEpochMilli()));
        return otp;
    }

    // Validate OTP with expiry
    public boolean validateOTP(String email, String otp) {
        OTPDetails details = otpStorage.get(email);
        if (details != null) {
            long currentTime = Instant.now().toEpochMilli();
            if (details.otp.equals(otp) && currentTime - details.timestamp <= OTP_VALID_DURATION) {
                return true;
            }
        }
        return false;
    }

    // Clear OTP after validation
    public void clearOTP(String email) {
        otpStorage.remove(email);
    }
}
