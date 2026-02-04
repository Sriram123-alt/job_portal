package com.jobportal.controller;

import com.jobportal.entity.Job;
import com.jobportal.service.JobService;
import com.jobportal.security.JwtTokenProvider;
import com.jobportal.security.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter/jobs")
public class RecruiterController {

    @Autowired
    private JobService jobService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @PostMapping
    // @PreAuthorize("hasRole('RECRUITER')") - Removed for manual validation
    public ResponseEntity<?> postJob(@RequestBody Job job, HttpServletRequest request) {
        String token = getTokenFromRequest(request);

        // 1. Check if token exists
        if (token == null) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Missing Auth Token"));
        }

        // 2. Check if token is valid
        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Invalid or Expired Token"));
        }

        // 3. Check User & Role
        String username = jwtTokenProvider.getUsername(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username); // Might throw exception if user gone

        boolean isRecruiter = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_RECRUITER"));

        if (!isRecruiter) {
            return ResponseEntity.status(403).body(java.util.Map.of(
                    "message", "Role Mismatch",
                    "authorities", userDetails.getAuthorities()));
        }

        // Manually set context for Service layer
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities()));

        Job createdJob = jobService.createJob(job);
        return ResponseEntity.ok(createdJob);
    }

    @GetMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public List<Job> getMyPostedJobs() {
        return jobService.getMyJobs();
    }

    @DeleteMapping("/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long jobId) {
        jobService.deleteJob(jobId);
        return ResponseEntity.ok().build();
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
