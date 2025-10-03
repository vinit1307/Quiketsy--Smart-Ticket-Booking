package com.ticketBooking.user.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private String fullName;
    private String role;

    // public LoginResponse(String token, String fullName, String role) {
    //     this.token = token;
    //     this.fullName = fullName;
    //     this.role = role;
    // }

    // public String getToken() {
    //     return token;
    // }

    // public String getFullName() {
    //     return fullName;
    // }

    // public String getRole() {
    //     return role;
    // }

}
