package com.jobportal.repository;

import com.jobportal.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findBySeeker_Id(Long seekerId);

    List<Application> findByJob_Id(Long jobId);

    boolean existsByJob_IdAndSeeker_Id(Long jobId, Long seekerId);
}
