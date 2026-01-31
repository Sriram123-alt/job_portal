package com.jobportal.dto;

import com.jobportal.entity.RecruiterProfile;
import com.jobportal.entity.SeekerProfile;
import com.jobportal.entity.User;
import lombok.Data;

@Data
public class UserProfileDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;

    // Seeker-specific fields
    private SeekerProfileDTO seekerProfile;

    // Recruiter-specific fields
    private RecruiterProfileDTO recruiterProfile;

    @Data
    public static class SeekerProfileDTO {
        private String resumeUrl;
        private String skills;
        private String education;
        private String experience;
        private Integer profileScore;
    }

    @Data
    public static class RecruiterProfileDTO {
        private String companyName;
        private String companyDescription;
        private String companyLocation;
        private String companyWebsite;
        private String contactPhone;
    }

    public static UserProfileDTO fromUser(User user, SeekerProfile seekerProfile, RecruiterProfile recruiterProfile) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole().name());

        if (seekerProfile != null) {
            SeekerProfileDTO seekerDTO = new SeekerProfileDTO();
            seekerDTO.setResumeUrl(seekerProfile.getResumeUrl());
            seekerDTO.setSkills(seekerProfile.getSkills());
            seekerDTO.setEducation(seekerProfile.getEducation());
            seekerDTO.setExperience(seekerProfile.getExperience());
            seekerDTO.setProfileScore(seekerProfile.getProfileScore());
            dto.setSeekerProfile(seekerDTO);
        }

        if (recruiterProfile != null) {
            RecruiterProfileDTO recruiterDTO = new RecruiterProfileDTO();
            recruiterDTO.setCompanyName(recruiterProfile.getCompanyName());
            recruiterDTO.setCompanyDescription(recruiterProfile.getCompanyDescription());
            recruiterDTO.setCompanyLocation(recruiterProfile.getCompanyLocation());
            recruiterDTO.setCompanyWebsite(recruiterProfile.getCompanyWebsite());
            recruiterDTO.setContactPhone(recruiterProfile.getContactPhone());
            dto.setRecruiterProfile(recruiterDTO);
        }

        return dto;
    }
}
