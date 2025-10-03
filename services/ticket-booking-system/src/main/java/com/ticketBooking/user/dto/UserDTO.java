package com.ticketBooking.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private String name;
    private String email;
    private String phoneNumber;
    private String dob;
    private String role; // Account type
}
