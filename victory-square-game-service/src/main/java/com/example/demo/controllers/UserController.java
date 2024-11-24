package com.example.demo.controllers;

import com.example.demo.messages.SuccessResponse;
import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/user")
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

//    @GetMapping("/invite")
//    public ResponseEntity<SuccessResponse> invite(@RequestParam("email") String email){
//
//    }
}
