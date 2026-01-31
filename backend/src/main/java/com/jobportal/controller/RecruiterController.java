package com.jobportal.controller;

import com.jobportal.entity.Job;
import com.jobportal.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter/jobs")
public class RecruiterController {

    @Autowired
    private JobService jobService;

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public Job postJob(@RequestBody Job job) {
        return jobService.createJob(job);
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
}
