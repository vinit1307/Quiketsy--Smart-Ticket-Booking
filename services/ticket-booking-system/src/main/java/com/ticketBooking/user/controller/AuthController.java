package com.ticketBooking.user.controller;

import com.ticketBooking.user.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.ticketBooking.user.repository.UserRepository;
import com.ticketBooking.security.JwtUtil;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String,String> body){
        if(UserRepository.findByEmail(body.get("email")).isPresent()){
        return ResponseEntity.badRequest().body("Email already exists!");
        }
    
    User user=new User(body.get("name"),
                body.get("email"),
                body.get("phoneNumber"),
                LocalDate.parse(body.get("dob")),
                passwordEncoder.encode(body.get("password"))
                );
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
}


 @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        User user = UserRepository.findByEmail(email).orElse(null);

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token", token, "email", email));
    }
}