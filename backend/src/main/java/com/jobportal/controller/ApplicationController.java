package com.jobportal.controller;

import com.jobportal.entity.Application;
import com.jobportal.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/{jobId}/apply")
    public Application applyJob(@PathVariable Long jobId,
            @RequestParam(value = "resume", required = false) MultipartFile resume)
            throws IOException {
        return applicationService.applyForJob(jobId, resume);
    }

    @GetMapping("/my-applications")
    public List<Application> getMyApplications() {
        return applicationService.getMyApplications();
    }

    @GetMapping("/job/{jobId}")
    public List<Application> getJobApplications(@PathVariable Long jobId) {
        return applicationService.getApplicationsForJob(jobId);
    }

    @PatchMapping("/{id}/status")
    public Application updateStatus(@PathVariable Long id,
            @RequestParam Application.Status status,
            @RequestParam(required = false) String message) {
        return applicationService.updateStatus(id, status, message);
    }

    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path file = rootLocation.resolve(filename).normalize();

            // Security check - ensure file is within upload directory
            if (!file.startsWith(rootLocation)) {
                throw new RuntimeException("Cannot access file outside upload directory");
            }

            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}
