package com.jobportal.payload;

import lombok.Data;

public class AuthDto {
    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String username;
        private String password;
        private String email;
        private String role; // "SEEKER", "RECRUITER"
    }

    @Data
    public static class JwtResponse {
        private String accessToken;
        private String tokenType = "Bearer";
        private String role;

        public JwtResponse(String accessToken, String role) {
            this.accessToken = accessToken;
            this.role = role;
        }
    }
}
