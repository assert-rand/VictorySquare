package com.example.authenticationservice.services;

import com.example.authenticationservice.models.AuthenticationRequest;
import com.example.authenticationservice.models.AuthenticationResponse;
import com.example.authenticationservice.models.RegisterRequest;
import com.example.authenticationservice.models.User;
import com.example.authenticationservice.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        request.setPassword(passwordEncoder.encode(request.getPassword()));
        var checkUser = repository.findById(request.getEmail());
        if(checkUser.isPresent()){
            return AuthenticationResponse.builder().token(null).message("User already exists.").build();
        }
        var newUser = new User(
            request.getEmail(),
            request.getPassword(),
            request.getName()
        );
        var user = repository.save(newUser);
        user.setPassword("");
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).message("User created successfully").user(user).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findById(request.getEmail()).orElseThrow();
        user.setPassword("");
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).message("Logged in successfully").user(user).build();
    }

    public void validateToken(String token) {
        jwtService.validateToken(token);
    }
}
