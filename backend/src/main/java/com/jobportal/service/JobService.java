package com.jobportal.service;

import com.jobportal.entity.Job;
import com.jobportal.entity.SeekerProfile;
import com.jobportal.entity.User;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SeekerProfileRepository;
import com.jobportal.repository.UserRepository;
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
    private UserRepository userRepository;

    @Autowired
    private SeekerProfileRepository seekerProfileRepository;

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job createJob(Job job) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != User.Role.RECRUITER && user.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Only Recruiters can post jobs");
        }

        job.setPostedBy(user);
        return jobRepository.save(job);
    }

    public List<Job> getMyJobs() {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return jobRepository.findByPostedBy_Id(user.getId());
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public void deleteJob(Long id) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));

        if (user.getRole() == User.Role.ADMIN || job.getPostedBy().getId().equals(user.getId())) {
            jobRepository.deleteById(id);
        } else {
            throw new RuntimeException("You are not authorized to delete this job");
        }
    }

    public List<Job> getJobsByRecruiter(Long recruiterId) {
        return jobRepository.findByPostedBy_Id(recruiterId);
    }

    public List<Job> getRecommendedJobs(User user) {
        List<Job> allJobs = jobRepository.findAll();

        // Fetch seeker profile
        SeekerProfile seekerProfile = seekerProfileRepository.findByUserId(user.getId()).orElse(null);

        if (seekerProfile == null || seekerProfile.getSkills() == null || seekerProfile.getSkills().isEmpty()) {
            return Collections.emptyList(); // No skills, no recommendations
        }

        String[] skills = seekerProfile.getSkills().toLowerCase().split(",\\s*");

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
