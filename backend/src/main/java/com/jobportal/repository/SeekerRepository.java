package com.jobportal.repository;

import com.jobportal.entity.Seeker;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SeekerRepository extends JpaRepository<Seeker, Long> {
    Optional<Seeker> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
