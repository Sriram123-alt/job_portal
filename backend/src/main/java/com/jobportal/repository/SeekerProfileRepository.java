package com.jobportal.repository;

import com.jobportal.entity.SeekerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeekerProfileRepository extends JpaRepository<SeekerProfile, Long> {
    Optional<SeekerProfile> findByUserId(Long userId);

    Optional<SeekerProfile> findByUser_Username(String username);
}
