package com.jobportal.service;

import com.jobportal.entity.Job;
import com.jobportal.entity.Recruiter;
import com.jobportal.entity.Seeker;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.RecruiterRepository;
import com.jobportal.repository.SeekerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private SeekerRepository seekerRepository;

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job createJob(Job job) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        Recruiter recruiter = recruiterRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        job.setPostedBy(recruiter);
        return jobRepository.save(job);
    }

    public List<Job> getMyJobs() {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        Recruiter recruiter = recruiterRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        return jobRepository.findByPostedBy_Id(recruiter.getId());
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public void deleteJob(Long id) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();

        // Try finding as Recruiter first (most likely)
        Recruiter recruiter = recruiterRepository.findByUsername(username).orElse(null);

        Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));

        boolean isOwner = recruiter != null && job.getPostedBy().getId().equals(recruiter.getId());

        // Admin check (if we had an Admin entity or role check, but for now strict
        // ownership)
        // If we want to support Admin, we might need a separate Admin flow or check
        // authorities
        boolean isAdmin = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isOwner || isAdmin) {
            jobRepository.deleteById(id);
        } else {
            throw new RuntimeException("You are not authorized to delete this job");
        }
    }

    public List<Job> getJobsByRecruiter(Long recruiterId) {
        return jobRepository.findByPostedBy_Id(recruiterId);
    }

    public List<Job> getRecommendedJobs(String username) {
        List<Job> allJobs = jobRepository.findAll();

        Seeker seeker = seekerRepository.findByUsername(username).orElse(null);

        if (seeker == null || seeker.getSkills() == null || seeker.getSkills().isEmpty()) {
            return Collections.emptyList(); // No skills, no recommendations
        }

        String[] skills = seeker.getSkills().toLowerCase().split(",\\s*");

        return allJobs.stream()
                .filter(job -> {
                    String jobText = (job.getTitle() + " " + job.getDescription()).toLowerCase();
                    if (job.getRequiredSkills() != null) {
                        jobText += " " + job.getRequiredSkills().toLowerCase();
                    }

                    for (String skill : skills) {
                        if (jobText.contains(skill))
                            return true;
                    }
                    return false;
                })
                .collect(Collectors.toList());
    }
}
