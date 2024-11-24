package com.example.authenticationservice.controller;


import com.example.authenticationservice.models.AuthenticationRequest;
import com.example.authenticationservice.models.AuthenticationResponse;
import com.example.authenticationservice.models.RegisterRequest;
import com.example.authenticationservice.services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/authentication-service")
public class AuthenticationController {
    @Autowired
    private AuthenticationService service;
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request){
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody AuthenticationRequest request
    ){
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/validate/{token}")
    public String validateToken(@PathVariable String token){
        service.validateToken(token);
        return "Valid";
    }
}
