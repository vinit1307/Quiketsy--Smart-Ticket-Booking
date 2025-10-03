package com.ticketBooking.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ticketBooking.user.dto.ChangePasswordRequest;
import com.ticketBooking.user.dto.UserDTO;
import com.ticketBooking.user.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/account")
    public ResponseEntity<UserDTO> getUserAccountDetails(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.getUserDetails(email));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(Authentication authentication,
                                            @RequestBody ChangePasswordRequest request) {
        String email = authentication.getName();
        return userService.changePassword(email, request);
    }
}
