package com.jobportal.controller;

import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/public")
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    @PostMapping
    public Job createJob(@RequestBody Job job) {
        return jobService.createJob(job);
    }

    @GetMapping("/my-jobs")
    public List<Job> getMyJobs() {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        User recruiter = userRepository.findByUsername(username).orElseThrow();
        return jobService.getJobsByRecruiter(recruiter.getId());
    }

    @GetMapping("/recommendations")
    public List<Job> getRecommendations() {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        User user = userRepository.findByUsername(username).orElseThrow();
        return jobService.getRecommendedJobs(user);
    }

    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) { // Kept ResponseEntity<Void> for syntactic
                                                                   // correctness
        jobService.deleteJob(id);
        return ResponseEntity.ok().build();
    }
}
