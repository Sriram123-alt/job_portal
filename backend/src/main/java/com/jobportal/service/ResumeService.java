package com.jobportal.service;

import com.jobportal.entity.Seeker;
import com.jobportal.repository.SeekerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
public class ResumeService {

    @Autowired
    private SeekerRepository seekerRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public Seeker parseAndSaveResume(String username, MultipartFile file) throws IOException {
        Seeker seeker = seekerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Seeker not found"));

        if (!file.getContentType().equals("application/pdf")) {
            throw new IllegalArgumentException("Only PDF files are supported");
        }

        // 1. Save File
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path targetLocation = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // 2. Extract Text
        String text = extractTextFromPdf(targetLocation.toFile());

        // 3. Extract Skills (Dummy implementation for now, replacing AI stub)
        // In a real app, this would call Python/AI service
        String extractedSkills = extractSkillsBasic(text);

        // 4. Update Seeker Entity
        seeker.setResumeUrl(fileName);
        seeker.setExtractedText(text.length() > 4500 ? text.substring(0, 4500) : text); // Truncate for DB safety
        seeker.setSkills(extractedSkills);
        seeker.setProfileScore(calculateProfileScore(text));

        // You might want to parse education/experience too if you have the logic
        // seeker.setEducation(...)

        return seekerRepository.save(seeker);
    }

    private String extractTextFromPdf(java.io.File file) throws IOException {
        try (PDDocument document = PDDocument.load(file)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractSkillsBasic(String text) {
        // Simple keyword matching
        List<String> commonSkills = Arrays.asList("Java", "Spring", "Python", "React", "JavaScript", "SQL", "Docker",
                "AWS");
        List<String> found = new ArrayList<>();
        String lowerText = text.toLowerCase();

        for (String skill : commonSkills) {
            if (lowerText.contains(skill.toLowerCase())) {
                found.add(skill);
            }
        }
        return String.join(", ", found);
    }

    private Integer calculateProfileScore(String text) {
        // Dummy score logic
        return Math.min(100, (text.length() / 100) + 50);
    }
}
