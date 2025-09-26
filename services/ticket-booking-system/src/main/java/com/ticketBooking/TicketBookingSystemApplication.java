package com.ticketBooking;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.ticketBooking.repos.UsersRepo;
import com.ticketBooking.utility.Users;

@SpringBootApplication
public class TicketBookingSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(TicketBookingSystemApplication.class, args);
		System.out.println("chal gya..");
	}
	
	DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
	String dobString = "26-09-2000"; // your dd-MM-yyyy date string
	LocalDate dob = LocalDate.parse(dobString, formatter);
    
	@Bean
    CommandLineRunner run(UsersRepo userRepository) {
        return args -> {
            Users user = new Users();
            user.setName("Vidhan Tayade");
            user.setEmail("vidhan@example.com");
            user.setName("vidhan123");
			user.setPhoneNumber("9087365978");
            user.setPassword("password123");
			user.setDateOfBirth(dob);
            
            userRepository.save(user);
            System.out.println("User saved successfully!");
        };
    }

}
