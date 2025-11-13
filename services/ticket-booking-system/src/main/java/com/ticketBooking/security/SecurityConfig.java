package com.ticketBooking.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                }) // use our CorsConfig
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // allow CORS preflight
                        .requestMatchers("/api/auth/**").permitAll()// allow register + login
                        .requestMatchers("/api/events/**").permitAll()
                        // .requestMatchers("/api/events/organizer/**").authenticated()
                        .requestMatchers("/api/booking/getKey").authenticated()
                        .requestMatchers("/api/booking/order").authenticated()
                        .requestMatchers("/api/booking/verify").permitAll()
                        .requestMatchers("/api/booking/verify-ticket").permitAll()
                        // .requestMatchers("/api/booking/**").authenticated()
                        // .requestMatchers("/api/events/trending").permitAll()
                        // .requestMatchers("/api/events/category/**").permitAll()
                        // .requestMatchers("/api/events/organizer/**").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
