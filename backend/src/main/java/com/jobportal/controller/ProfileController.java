package com.jobportal.controller;

import com.jobportal.dto.UserProfileDTO;
import com.jobportal.entity.RecruiterProfile;
import com.jobportal.entity.SeekerProfile;
import com.jobportal.entity.User;
import com.jobportal.repository.RecruiterProfileRepository;
import com.jobportal.repository.SeekerProfileRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SeekerProfileRepository seekerProfileRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @PostMapping("/resume")
    public ResponseEntity<SeekerProfile> uploadResume(@RequestParam("file") MultipartFile file) throws IOException {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        SeekerProfile seekerProfile = resumeService.parseAndSaveResume(username, file);
        return ResponseEntity.ok(seekerProfile);
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getMyProfile() {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch associated profiles based on role
        SeekerProfile seekerProfile = null;
        RecruiterProfile recruiterProfile = null;

        if (user.getRole() == User.Role.SEEKER) {
            seekerProfile = seekerProfileRepository.findByUserId(user.getId()).orElse(null);
        } else if (user.getRole() == User.Role.RECRUITER) {
            recruiterProfile = recruiterProfileRepository.findByUserId(user.getId()).orElse(null);
        }

        UserProfileDTO dto = UserProfileDTO.fromUser(user, seekerProfile, recruiterProfile);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/recruiter")
    public ResponseEntity<RecruiterProfile> updateRecruiterProfile(@RequestBody RecruiterProfile profileData) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RecruiterProfile profile = recruiterProfileRepository.findByUserId(user.getId())
                .orElse(new RecruiterProfile());

        profile.setUser(user);
        profile.setCompanyName(profileData.getCompanyName());
        profile.setCompanyDescription(profileData.getCompanyDescription());
        profile.setCompanyLocation(profileData.getCompanyLocation());
        profile.setCompanyWebsite(profileData.getCompanyWebsite());
        profile.setContactPhone(profileData.getContactPhone());

        return ResponseEntity.ok(recruiterProfileRepository.save(profile));
    }
}
