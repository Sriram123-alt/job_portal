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

        return jobRepository.findByPostedBy(recruiter);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElse(null);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    public List<Job> getRecommendedJobs(String username) {
        Seeker seeker = seekerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Seeker not found"));

        String resumeSkills = seeker.getSkills();
        if (resumeSkills == null || resumeSkills.isEmpty()) {
            return Collections.emptyList();
        }

        List<Job> allJobs = jobRepository.findAll();
        return allJobs.stream()
                .filter(job -> {
                    String requiredSkills = job.getRequiredSkills();
                    if (requiredSkills == null || requiredSkills.isEmpty()) {
                        return false;
                    }
                    String[] seekerSkillArr = resumeSkills.toLowerCase().split(",\\s*");
                    String[] jobSkillArr = requiredSkills.toLowerCase().split(",\\s*");
                    for (String sSkill : seekerSkillArr) {
                        for (String jSkill : jobSkillArr) {
                            if (sSkill.trim().equals(jSkill.trim())) {
                                return true;
                            }
                        }
                    }
                    return false;
                })
                .collect(Collectors.toList());
    }

    public Job updateJob(Long id, Job jobDetails) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        Recruiter recruiter = recruiterRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        Job existingJob = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));

        // Security check: Only the recruiter who posted the job can update it
        if (!existingJob.getPostedBy().getId().equals(recruiter.getId())) {
            throw new RuntimeException("You are not authorized to update this job");
        }

        existingJob.setTitle(jobDetails.getTitle());
        existingJob.setDescription(jobDetails.getDescription());
        existingJob.setCompany(jobDetails.getCompany());
        existingJob.setLocation(jobDetails.getLocation());
        existingJob.setSalary(jobDetails.getSalary());
        existingJob.setRequiredSkills(jobDetails.getRequiredSkills());

        return jobRepository.save(existingJob);
    }
}
