package com.ticketBooking.user.model;

import java.time.LocalDate;

import jakarta.persistence.*;


@Entity
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false,unique=true)
    private String email;

    private String phoneNumber;

    private LocalDate dob;

    @Column(nullable = false)
    private String password;

    public User(String name, String email, String phoneNumber, LocalDate dob, String password) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.dob = dob;
        this.password = password;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
