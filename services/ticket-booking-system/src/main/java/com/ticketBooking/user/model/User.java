package com.ticketBooking.user.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name="users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "full_name", nullable = false)
    private String name;

    @Column(nullable = false,unique=true)
    private String email;

    @Column(name = "phone",nullable = false)
    private String phone;


    private LocalDate dob;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;   // USER or ORGANIZER

   // @Column(name = "date_joined", nullable = false)
    // private LocalDateTime dateJoined = LocalDateTime.now();

    @Column(name = "date_joined", nullable = false)
    @Builder.Default  // ✅ For Builder pattern
    private LocalDateTime dateJoined = LocalDateTime.now();

    // ✅ Safety net - just in case
    @PrePersist
    public void prePersist() {
        if (this.dateJoined == null) {
            this.dateJoined = LocalDateTime.now();
        }
        if (this.role == null) {
            this.role = "USER";
        }
    }
    // public User(String name, String email, String phoneNumber, LocalDate dob, String password, String role) {
    //     this.name = name;
    //     this.email = email;
    //     this.phone = phoneNumber;
    //     this.dob = dob;
    //     this.password = password;
    //     this.role = role != null ? role.toUpperCase() : "USER";
    //     this.dateJoined = LocalDateTime.now();
    // }

    // // Getters and setters
    // public Long getId() { return id; }
    // public void setId(Long id) { this.id = id; }

    // public String getName() { return name; }
    // public void setName(String name) { this.name = name; }

    // public String getEmail() { return email; }
    // public void setEmail(String email) { this.email = email; }

    // public String getPhoneNumber() { return phone; }
    // public void setPhoneNumber(String phoneNumber) { this.phone = phoneNumber; }

    // public LocalDate getDob() { return dob; }
    // public void setDob(LocalDate dob) { this.dob = dob; }

    // public String getPassword() { return password; }
    // public void setPassword(String password) { this.password = password; }

    // public String getRole() { return role; }
    // public void setRole(String role) { this.role = role; }

    // public LocalDateTime getDateJoined() { return dateJoined; }
    // public void setDateJoined(LocalDateTime dateJoined) { this.dateJoined = dateJoined; }


    // public User(){}
}
