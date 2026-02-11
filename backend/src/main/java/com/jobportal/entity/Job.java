package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String company;
    private String location;
    private Double salary;

    @Column(name = "required_skills")
    private String requiredSkills;

    @Column(name = "posted_at")
    private LocalDateTime postedAt;

    @ManyToOne
    @JoinColumn(name = "posted_by", nullable = false, foreignKey = @ForeignKey(name = "FK_job_recruiter"))
    private Recruiter postedBy; // The Recruiter

    @PrePersist
    protected void onCreate() {
        postedAt = LocalDateTime.now();
    }
}
