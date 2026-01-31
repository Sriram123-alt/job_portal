package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "seeker_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeekerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

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
