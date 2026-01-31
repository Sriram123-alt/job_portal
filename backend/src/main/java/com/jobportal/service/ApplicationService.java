package com.jobportal.service;

import com.jobportal.entity.Application;
import com.jobportal.entity.Job;
import com.jobportal.entity.SeekerProfile;
import com.jobportal.entity.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SeekerProfileRepository;
import com.jobportal.repository.UserRepository;
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
    private UserRepository userRepository;

    @Autowired
    private SeekerProfileRepository seekerProfileRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public Application applyForJob(Long jobId, MultipartFile resume) throws IOException {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        User seeker = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepository.existsByJob_IdAndSeeker_Id(jobId, seeker.getId())) {
            throw new RuntimeException("You have already applied for this job");
        }

        // Get seeker profile
        SeekerProfile seekerProfile = seekerProfileRepository.findByUserId(seeker.getId())
                .orElseThrow(() -> new RuntimeException("Seeker profile not found. Please upload your resume first."));

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
        } else if (seekerProfile.getResumeUrl() != null) {
            fileName = seekerProfile.getResumeUrl();
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
        User seeker = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return applicationRepository.findBySeeker_Id(seeker.getId());
    }

    public List<Application> getApplicationsForJob(Long jobId) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getPostedBy().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Unauthorized: You are not the recruiter for this job");
        }

        return applicationRepository.findByJob_Id(jobId);
    }

    @Autowired
    private EmailService emailService;

    public Application updateStatus(Long applicationId, Application.Status status, String message) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!app.getJob().getPostedBy().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Unauthorized to update application status");
        }

        app.setStatus(status);
        Application savedApp = applicationRepository.save(app);

        // Send Email if Shortlisted
        if (status == Application.Status.SHORTLISTED) {
            String subject = "Update on your application for " + app.getJob().getTitle();
            String body = "Dear " + app.getSeeker().getFullName() + ",\n\n" +
                    "Congratulations! You have been shortlisted for the position of " + app.getJob().getTitle() + " at "
                    + app.getJob().getCompany() + ".\n\n";

            if (message != null && !message.isEmpty()) {
                body += message + "\n\n";
            } else {
                body += "The recruiter will contact you shortly with further details regarding the interview/test process.\n\n";
            }

            body += "Best regards,\nRecruitment Team";

            emailService.sendEmail(app.getSeeker().getEmail(), subject, body);
        }

        return savedApp;
    }
}
