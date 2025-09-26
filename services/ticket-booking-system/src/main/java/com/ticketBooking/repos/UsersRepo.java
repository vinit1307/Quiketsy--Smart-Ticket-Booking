package com.ticketBooking.repos;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ticketBooking.utility.Users;

@Repository
public interface UsersRepo extends JpaRepository<Users, Integer> {
    boolean existsByEmail(String email);
}
