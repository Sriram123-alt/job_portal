package com.jobportal.service;

import com.jobportal.entity.SeekerProfile;
import com.jobportal.entity.User;
import com.jobportal.repository.SeekerProfileRepository;
import com.jobportal.repository.UserRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
public class ResumeService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SeekerProfileRepository seekerProfileRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final List<String> TECH_KEYWORDS = Arrays.asList(
            "Java", "Python", "React", "Angular", "Vue", "Spring", "Node.js", "JavaScript", "TypeScript",
            "SQL", "MySQL", "PostgreSQL", "MongoDB", "AWS", "Docker", "Kubernetes", "Git", "CI/CD",
            "HTML", "CSS", "Rest API", "Microservices", "Machine Learning", "Data Science");

    public SeekerProfile parseAndSaveResume(String username, MultipartFile file) throws IOException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Save File
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // 2. Parse Text using PDFBox
        String text = "";
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            text = stripper.getText(document);
        }

        // 3. Extract Skills & Details
        Set<String> foundSkills = new HashSet<>();
        String lowerText = text.toLowerCase();
        for (String tech : TECH_KEYWORDS) {
            if (lowerText.contains(tech.toLowerCase())) {
                foundSkills.add(tech);
            }
        }

        // 3.1 Extract Email (Simple Regex)
        String email = extractEmail(text);

        // 3.2 Extract Sections (Heuristic)
        String education = extractSection(text, "Education");
        String experience = extractSection(text, "Experience", "Work History", "Employment");

        // 3.3 Name (Heuristic - First line or filename)
        String name = Arrays.stream(text.split("\n")).findFirst().orElse(username).trim();

        // 4. Calculate Score
        int score = 20;
        score += foundSkills.size() * 5;
        if (text.length() > 500)
            score += 20;
        if (email != null)
            score += 10;
        if (education != null && education.length() > 10)
            score += 10;
        if (score > 100)
            score = 100;

        // 5. Update or Create SeekerProfile
        SeekerProfile seekerProfile = seekerProfileRepository.findByUserId(user.getId())
                .orElse(new SeekerProfile());

        seekerProfile.setUser(user);
        seekerProfile.setResumeUrl(fileName);
        seekerProfile.setExtractedText(text.length() > 4900 ? text.substring(0, 4900) : text);
        seekerProfile.setSkills(String.join(", ", foundSkills));
        seekerProfile.setProfileScore(score);
        seekerProfile.setEducation(
                education != null && education.length() > 1900 ? education.substring(0, 1900) : education);
        seekerProfile.setExperience(
                experience != null && experience.length() > 1900 ? experience.substring(0, 1900) : experience);

        // Update user's full name if extracted
        if (name.length() > 0 && name.length() < 100) {
            user.setFullName(name.length() > 50 ? name.substring(0, 50) : name);
            userRepository.save(user);
        }

        return seekerProfileRepository.save(seekerProfile);
    }

    private String extractEmail(String text) {
        java.util.regex.Pattern p = java.util.regex.Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}");
        java.util.regex.Matcher m = p.matcher(text);
        if (m.find())
            return m.group();
        return null;
    }

    private String extractSection(String text, String... headers) {
        String lower = text.toLowerCase();
        int bestIndex = -1;
        for (String h : headers) {
            int idx = lower.indexOf(h.toLowerCase());
            if (idx != -1 && (bestIndex == -1 || idx < bestIndex)) {
                bestIndex = idx;
            }
        }

        if (bestIndex == -1)
            return null;

        // Grab next 500 chars or until next double-newline
        int start = bestIndex;
        int end = Math.min(start + 500, text.length());
        return text.substring(start, end).replaceAll("\r", "").replaceAll("\n", " ").trim();
    }
}
