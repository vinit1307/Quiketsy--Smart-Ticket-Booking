package com.ticketBooking.user.repository;

import com.ticketBooking.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA will automatically create the query
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
