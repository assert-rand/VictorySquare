package com.example.demo.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "_user")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @Id
    private String email;
    private String name;
    private String password;
    private int humanGamesWon;
    private int humanGamesLost;
    private int computerGamesWon;
    private int computerGamesLost;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications = new ArrayList<>();

    public void addNotification(Notification notification){
        notifications.add(notification);
    }

    public void deleteNotification(long notificationId){
        notifications.removeIf(notification -> notification.getId() == notificationId);
    }
}
