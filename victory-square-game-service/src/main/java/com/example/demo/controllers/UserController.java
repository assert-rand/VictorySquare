package com.example.demo.controllers;

import com.example.demo.messages.Invitation;
import com.example.demo.messages.SuccessResponse;
import com.example.demo.models.Notification;
import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/game-service/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/search")
    public ResponseEntity<User> search(@RequestParam("email") String email){
        Optional<User> user = userRepository.findById(email);
        if(user.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        User returnUser = user.get();
        returnUser.setPassword("");
        return ResponseEntity.ok(returnUser);
    }

    @PostMapping("/invite")
    public ResponseEntity<SuccessResponse> invite(@RequestParam("email") String email, @RequestBody Invitation invitation){
        Optional<User> user = userRepository.findById(email);
        if(user.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        User invitee = user.get();
        Notification notification = Notification.builder()
                .gameCode(invitation.getGameCode())
                .inviterEmail(invitation.getInviteeEmail())
                .inviterName(invitation.getInviteeName())
                .message(invitation.getMessage())
                .user(invitee.getEmail())
                .build();

        if(invitee.getNotifications().size() > 10){
            return ResponseEntity.badRequest().build();
        }

        invitee.addNotification(notification);
        userRepository.save(invitee);
        return ResponseEntity.ok(new SuccessResponse(true));
    }

    @DeleteMapping("/notification/delete")
    public ResponseEntity<SuccessResponse> deleteNotification(@RequestParam("email") String email, @RequestParam("id") long notificationId){
        Optional<User> user = userRepository.findById(email);
        if(user.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        User invitee = user.get();
        invitee.deleteNotification(notificationId);
        userRepository.save(invitee);

        return ResponseEntity.ok(new SuccessResponse(true));
    }

    @GetMapping("/notification/get")
    public ResponseEntity<List<Notification>> getNotifications(@RequestParam("email") String email){
        Optional<User> user = userRepository.findById(email);
        if(user.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        User invitee = user.get();
        return ResponseEntity.ok(invitee.getNotifications());
    }
}
