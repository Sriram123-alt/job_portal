package com.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "seekers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seeker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- User Fields ---
    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "full_name")
    private String fullName;

    // --- SeekerProfile Fields ---
    @Column(name = "resume_url")
    private String resumeUrl;

    @Column(length = 1000)
    private String skills;

    @Column(length = 2000)
    private String education;

    @Column(length = 2000)
    private String experience;

    @Column(name = "extracted_text", length = 5000)
    private String extractedText;

    @Column(name = "profile_score")
    private Integer profileScore;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
