package com.jobportal.service;

import com.jobportal.entity.Application;
import com.jobportal.entity.Job;
import com.jobportal.entity.Recruiter;
import com.jobportal.entity.Seeker;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.RecruiterRepository;
import com.jobportal.repository.SeekerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private SeekerRepository seekerRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public Application applyForJob(Long jobId, MultipartFile resume) throws IOException {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        Seeker seeker = seekerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Seeker not found"));

        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepository.existsByJob_IdAndSeeker_Id(jobId, seeker.getId())) {
            throw new RuntimeException("You have already applied for this job");
        }

        // Save File or Use Existing
        String fileName;
        if (resume != null && !resume.isEmpty()) {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            fileName = UUID.randomUUID() + "_" + resume.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(resume.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } else if (seeker.getResumeUrl() != null) {
            fileName = seeker.getResumeUrl();
        } else {
            throw new RuntimeException("No resume found. Please upload one to your profile first.");
        }

        Application application = new Application();
        application.setJob(job);
        application.setSeeker(seeker);
        application.setResumePath(fileName);

        return applicationRepository.save(application);
    }

    public List<Application> getMyApplications() {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        Seeker seeker = seekerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Seeker not found"));
        return applicationRepository.findBySeeker_Id(seeker.getId());
    }

    public List<Application> getApplicationsForJob(Long jobId) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();

        Recruiter recruiter = recruiterRepository.findByUsername(username).orElse(null);
        boolean isAdmin = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        boolean isOwner = recruiter != null && job.getPostedBy().getId().equals(recruiter.getId());

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Unauthorized: You are not the recruiter for this job");
        }

        return applicationRepository.findByJob_Id(jobId);
    }

    public Application updateStatus(Long applicationId, Application.Status status, String message,
            String testDateTime) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        Recruiter recruiter = recruiterRepository.findByUsername(username).orElse(null);
        boolean isAdmin = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        boolean isOwner = recruiter != null && app.getJob().getPostedBy().getId().equals(recruiter.getId());

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Unauthorized to update application status");
        }

        app.setStatus(status);

        // Set test date/time and message if shortlisted
        if (status == Application.Status.SHORTLISTED && testDateTime != null && !testDateTime.isEmpty()) {
            try {
                app.setTestDateTime(java.time.LocalDateTime.parse(testDateTime));
                app.setTestMessage(message);
            } catch (Exception e) {
                System.out.println("Error parsing testDateTime: " + e.getMessage());
            }
        }

        return applicationRepository.save(app);
    }

    public Application saveTestScore(Long applicationId, Integer score) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        Seeker seeker = seekerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Seeker not found"));

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Verify the application belongs to this seeker
        if (!app.getSeeker().getId().equals(seeker.getId())) {
            throw new RuntimeException("Unauthorized: This application does not belong to you");
        }

        // Check if test was already taken
        if (app.getTestScore() != null) {
            throw new RuntimeException("Test has already been taken for this application");
        }

        app.setTestScore(score);
        app.setTestTakenAt(java.time.LocalDateTime.now());

        return applicationRepository.save(app);
    }

    public Application getApplicationById(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    public List<Application> scheduleAllTests(Long jobId, String testDateTime, String message) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        Recruiter recruiter = recruiterRepository.findByUsername(username).orElse(null);
        boolean isAdmin = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        boolean isOwner = recruiter != null && job.getPostedBy().getId().equals(recruiter.getId());

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Unauthorized: You are not the recruiter for this job");
        }

        List<Application> applications = applicationRepository.findByJob_Id(jobId);

        for (Application app : applications) {
            // Only schedule for those not already rejected
            if (app.getStatus() != Application.Status.REJECTED) {
                app.setStatus(Application.Status.SHORTLISTED);
                if (testDateTime != null && !testDateTime.isEmpty()) {
                    try {
                        app.setTestDateTime(java.time.LocalDateTime.parse(testDateTime));
                        app.setTestMessage(message);
                    } catch (Exception e) {
                        System.out.println("Error parsing testDateTime for app " + app.getId() + ": " + e.getMessage());
                    }
                }
            }
        }

        return applicationRepository.saveAll(applications);
    }
}
