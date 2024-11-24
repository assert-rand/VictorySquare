package com.example.demo.messages;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class GameMessage {
    private String sender;
    private String content;
}