package com.example.demo.messages;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Invitation {
    private String inviteeEmail;
    private String inviteeName;
    private String message;
    private String gameCode;
}
