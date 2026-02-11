package com.jobportal.repository;

import com.jobportal.entity.Job;
import com.jobportal.entity.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByPostedBy(Recruiter recruiter);

    List<Job> findByPostedBy_Id(Long userId);

    List<Job> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(String title, String location);
}
