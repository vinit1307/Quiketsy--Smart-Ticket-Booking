package com.ticketBooking.serives;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ticketBooking.repos.UsersRepo;
import com.ticketBooking.utility.Users;


@Service
public class UsersServices {

    @Autowired
    private UsersRepo userRepository;

    public Users registerUser(Users user) throws Exception {
        if(userRepository.existsByEmail(user.getEmail())) {
            throw new Exception("Email already registered!");
        }
        return userRepository.save(user);
    }
}

