package com.taskmanagement.backend.controller;

import com.taskmanagement.backend.entity.User;
import com.taskmanagement.backend.repository.UserRepository;
import com.taskmanagement.backend.service.UserService;
import com.taskmanagement.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {


            user.setPasswordHash(encoder.encode(user.getPasswordHash()));

            if (userRepository.count() == 0) {
                user.setRole("ADMIN");
            } else {
                user.setRole("USER");
            }

            User savedUser = userService.createUser(user);
            return ResponseEntity.ok(savedUser);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        return userRepository.findByEmail(user.getEmail())
                .map(existing -> {

                    if (encoder.matches(user.getPasswordHash(), existing.getPasswordHash())) {

                        String token = JwtUtil.generateToken(
                                existing.getEmail(),
                                existing.getRole(),
                                existing.getId()
                        );

                        return ResponseEntity.ok(token);
                    } else {
                        return ResponseEntity.status(401).body("Invalid credentials");
                    }

                })
                .orElse(ResponseEntity.status(401).body("Invalid credentials"));
    }
}