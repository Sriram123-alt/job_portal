package com.jobportal.controller;

import com.jobportal.dto.UserProfileDTO;
import com.jobportal.entity.Recruiter;
import com.jobportal.entity.Seeker;
import com.jobportal.repository.RecruiterRepository;
import com.jobportal.repository.SeekerRepository;
import com.jobportal.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private SeekerRepository seekerRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @PostMapping("/resume")
    public ResponseEntity<Seeker> uploadResume(@RequestParam("file") MultipartFile file) throws IOException {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        Seeker seeker = resumeService.parseAndSaveResume(username, file);
        return ResponseEntity.ok(seeker);
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getMyProfile() {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();

        Optional<Seeker> seeker = seekerRepository.findByUsername(username);
        if (seeker.isPresent()) {
            return ResponseEntity.ok(UserProfileDTO.fromSeeker(seeker.get()));
        }

        Optional<Recruiter> recruiter = recruiterRepository.findByUsername(username);
        if (recruiter.isPresent()) {
            return ResponseEntity.ok(UserProfileDTO.fromRecruiter(recruiter.get()));
        }

        throw new RuntimeException("User not found");
    }

    @PutMapping("/recruiter")
    public ResponseEntity<Recruiter> updateRecruiterProfile(@RequestBody Recruiter profileData) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();

        Recruiter recruiter = recruiterRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        recruiter.setCompanyName(profileData.getCompanyName());
        recruiter.setCompanyDescription(profileData.getCompanyDescription());
        recruiter.setCompanyLocation(profileData.getCompanyLocation());
        recruiter.setCompanyWebsite(profileData.getCompanyWebsite());
        recruiter.setContactPhone(profileData.getContactPhone());

        return ResponseEntity.ok(recruiterRepository.save(recruiter));
    }
}
