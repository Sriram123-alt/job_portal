package com.jobportal.dto;

import com.jobportal.entity.Recruiter;
import com.jobportal.entity.Seeker;
import lombok.Data;

@Data
public class UserProfileDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;

    // Seeker Fields
    private String resumeUrl;
    private String skills;
    private String education;
    private String experience;
    private Integer profileScore;

    // Recruiter Fields
    private String companyName;
    private String companyDescription;
    private String companyLocation;
    private String companyWebsite;
    private String contactPhone;

    public static UserProfileDTO fromSeeker(Seeker seeker) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(seeker.getId());
        dto.setUsername(seeker.getUsername());
        dto.setEmail(seeker.getEmail());
        dto.setFullName(seeker.getFullName());
        dto.setRole("SEEKER");

        dto.setResumeUrl(seeker.getResumeUrl());
        dto.setSkills(seeker.getSkills());
        dto.setEducation(seeker.getEducation());
        dto.setExperience(seeker.getExperience());
        dto.setProfileScore(seeker.getProfileScore());

        return dto;
    }

    public static UserProfileDTO fromRecruiter(Recruiter recruiter) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(recruiter.getId());
        dto.setUsername(recruiter.getUsername());
        dto.setEmail(recruiter.getEmail());
        dto.setFullName(recruiter.getFullName());
        dto.setRole("RECRUITER");

        dto.setCompanyName(recruiter.getCompanyName());
        dto.setCompanyDescription(recruiter.getCompanyDescription());
        dto.setCompanyLocation(recruiter.getCompanyLocation());
        dto.setCompanyWebsite(recruiter.getCompanyWebsite());
        dto.setContactPhone(recruiter.getContactPhone());

        return dto;
    }
}
