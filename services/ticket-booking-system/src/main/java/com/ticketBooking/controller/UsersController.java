package com.ticketBooking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ticketBooking.serives.UsersServices;
import com.ticketBooking.utility.Users;


@RestController
@RequestMapping("/users")
//@CrossOrigin(origins = "http://localhost:3000") // React frontend
public class UsersController {

    @Autowired
    private UsersServices userService;

    @PostMapping("/singup")
    public Users registerUser(@RequestBody Users users) throws Exception {
        return userService.registerUser(users);
    }
}

