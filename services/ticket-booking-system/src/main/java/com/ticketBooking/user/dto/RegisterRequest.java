package com.ticketBooking.user.dto;

import java.time.LocalDate;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    private String name;
    private String email;
    private String phone;
    private LocalDate dob;
    private String password;
    private String role;
    // public String getName() {
    //     return name;
    // }
    // public void setName(String name) {
    //     this.name = name;
    // }
    // public String getEmail() {
    //     return email;
    // }
    // public void setEmail(String email) {
    //     this.email = email;
    // }
    // public String getPhone() {
    //     return phone;
    // }
    // public void setPhone(String phone) {
    //     this.phone = phone;
    // }
    // public LocalDate getDob() {
    //     return dob;
    // }
    // public void setDob(LocalDate dob) {
    //     this.dob = dob;
    // }
    // public String getPassword() {
    //     return password;
    // }
    // public void setPassword(String password) {
    //     this.password = password;
    // }
    // public String getRole() {
    //     return role;
    // }
    // public void setRole(String role) {
    //     this.role = role;
    // }
    

    
}
