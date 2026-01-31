package com.jobportal.controller;

import com.jobportal.entity.User;
import com.jobportal.payload.AuthDto;
import com.jobportal.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private com.jobportal.repository.UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthDto.JwtResponse> login(@RequestBody AuthDto.LoginRequest loginRequest) {
        // Redundant endpoint, but keeping consistent
        return signin(loginRequest);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthDto.JwtResponse> signin(@RequestBody AuthDto.LoginRequest loginRequest) {
        String token = authService.login(loginRequest);
        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();
        return ResponseEntity.ok(new AuthDto.JwtResponse(token, user.getRole().name()));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AuthDto.RegisterRequest registerRequest) {
        authService.register(registerRequest);
        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }
}
