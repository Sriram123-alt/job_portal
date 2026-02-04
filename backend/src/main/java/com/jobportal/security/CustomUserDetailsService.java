package com.jobportal.security;

import com.jobportal.entity.Recruiter;
import com.jobportal.entity.Seeker;
import com.jobportal.repository.RecruiterRepository;
import com.jobportal.repository.SeekerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

@Service
public class CustomUserDetailsService implements UserDetailsService {

        @Autowired
        private SeekerRepository seekerRepository;

        @Autowired
        private RecruiterRepository recruiterRepository;

        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                Optional<Seeker> seeker = seekerRepository.findByUsername(username);
                if (seeker.isPresent()) {
                        return buildUserDetails(seeker.get().getUsername(), seeker.get().getPassword(), "ROLE_SEEKER");
                }

                Optional<Recruiter> recruiter = recruiterRepository.findByUsername(username);
                if (recruiter.isPresent()) {
                        return buildUserDetails(recruiter.get().getUsername(), recruiter.get().getPassword(),
                                        "ROLE_RECRUITER");
                }

                throw new UsernameNotFoundException("User not found with username: " + username);
        }

        private UserDetails buildUserDetails(String username, String password, String role) {
                Set<GrantedAuthority> authorities = Collections.singleton(new SimpleGrantedAuthority(role));
                return new org.springframework.security.core.userdetails.User(username, password, authorities);
        }
}
