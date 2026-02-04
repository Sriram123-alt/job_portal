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
@Table(name = "applications")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne
    @JoinColumn(name = "seeker_id", nullable = false)
    private Seeker seeker;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String resumePath;

    @Column(name = "applied_at")
    private LocalDateTime appliedAt;

    @Column(name = "test_date_time")
    private LocalDateTime testDateTime;

    @Column(name = "test_message", length = 500)
    private String testMessage;

    @Column(name = "test_score")
    private Integer testScore;

    @Column(name = "test_taken_at")
    private LocalDateTime testTakenAt;

    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
        if (status == null) {
            status = Status.APPLIED;
        }
    }

    public enum Status {
        APPLIED, SHORTLISTED, REJECTED
    }
}
