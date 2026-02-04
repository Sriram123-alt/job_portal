package com.jobportal.controller;

import com.jobportal.entity.Recruiter;
import com.jobportal.entity.Seeker;
import com.jobportal.payload.AuthDto;
import com.jobportal.repository.RecruiterRepository;
import com.jobportal.repository.SeekerRepository;
import com.jobportal.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private SeekerRepository seekerRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthDto.JwtResponse> login(@RequestBody AuthDto.LoginRequest loginRequest) {
        return signin(loginRequest);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthDto.JwtResponse> signin(@RequestBody AuthDto.LoginRequest loginRequest) {
        String token = authService.login(loginRequest);

        String role = "UNKNOWN";
        if (seekerRepository.existsByUsername(loginRequest.getUsername())) {
            role = "SEEKER";
        } else if (recruiterRepository.existsByUsername(loginRequest.getUsername())) {
            role = "RECRUITER";
        }

        return ResponseEntity.ok(new AuthDto.JwtResponse(token, role));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AuthDto.RegisterRequest registerRequest) {
        authService.register(registerRequest);
        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }
}
