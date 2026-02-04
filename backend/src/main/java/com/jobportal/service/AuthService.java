package com.jobportal.service;

import com.jobportal.entity.Recruiter;
import com.jobportal.entity.Seeker;
import com.jobportal.payload.AuthDto;
import com.jobportal.repository.RecruiterRepository;
import com.jobportal.repository.SeekerRepository;
import com.jobportal.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private SeekerRepository seekerRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public String login(AuthDto.LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtTokenProvider.generateToken(authentication);
    }

    @org.springframework.transaction.annotation.Transactional
    public void register(AuthDto.RegisterRequest registerRequest) {
        if (seekerRepository.existsByUsername(registerRequest.getUsername()) ||
                recruiterRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        try {
            String role = registerRequest.getRole().toUpperCase();
            String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());

            if ("SEEKER".equals(role)) {
                Seeker seeker = new Seeker();
                seeker.setUsername(registerRequest.getUsername());
                seeker.setEmail(registerRequest.getEmail());
                seeker.setPassword(encodedPassword);
                seekerRepository.save(seeker);
            } else if ("RECRUITER".equals(role)) {
                Recruiter recruiter = new Recruiter();
                recruiter.setUsername(registerRequest.getUsername());
                recruiter.setEmail(registerRequest.getEmail());
                recruiter.setPassword(encodedPassword);
                recruiterRepository.save(recruiter);
            } else {
                throw new RuntimeException("Invalid role provided");
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }
}
