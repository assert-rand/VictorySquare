package com.example.authenticationservice.repositories;

import com.example.authenticationservice.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}
