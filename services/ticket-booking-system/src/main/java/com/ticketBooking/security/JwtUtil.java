package com.ticketBooking.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Either generate a random secure key (changes every restart)
    // private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    // Or use a fixed long secret string (recommended for production)
    private static final String SECRET = "mysuperlongsecuresecretmysuperlongsecuresecretmysuperlongsecuresecret123";
    private static final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    private final long expirationMs = 3600000; // 1 day

    //  @Value("${jwt.secret}")
    //  private String SECRET;

    //  private Key key;

    //  @Value("${jwt.expirationMs}")
    //  private long expirationMs;

    //  @PostConstruct
    //  public void init() {
    //      key  = Keys.hmacShaKeyFor(SECRET.getBytes());
    //  }
    // Generate JWT token
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    // Extract email from token
    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Validate token
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
