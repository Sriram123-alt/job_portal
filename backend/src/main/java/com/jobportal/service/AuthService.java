package com.jobportal.service;

import com.jobportal.entity.RecruiterProfile;
import com.jobportal.entity.SeekerProfile;
import com.jobportal.entity.User;
import com.jobportal.payload.AuthDto;
import com.jobportal.repository.RecruiterProfileRepository;
import com.jobportal.repository.SeekerProfileRepository;
import com.jobportal.repository.UserRepository;
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
    private UserRepository userRepository;

    @Autowired
    private SeekerProfileRepository seekerProfileRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

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
    public User register(AuthDto.RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        try {
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setRole(User.Role.valueOf(registerRequest.getRole().toUpperCase()));

            // Save user first
            user = userRepository.save(user);

            // Create empty profile based on role
            if (user.getRole() == User.Role.SEEKER) {
                SeekerProfile seekerProfile = new SeekerProfile();
                seekerProfile.setUser(user);
                seekerProfileRepository.save(seekerProfile);
            } else if (user.getRole() == User.Role.RECRUITER) {
                RecruiterProfile recruiterProfile = new RecruiterProfile();
                recruiterProfile.setUser(user);
                recruiterProfileRepository.save(recruiterProfile);
            }

            return user;
        } catch (Exception e) {
            e.printStackTrace(); // Log the actual error
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }
}
