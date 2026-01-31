package com.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender emailSender;

    @Value("${spring.mail.username:noreply@jobportal.com}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String text) {
        System.out.println("Attempting to send email to: " + to);
        if (emailSender == null) {
            logMockEmail(to, subject, text);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            emailSender.send(message);
            System.out.println("Email Sent Successfully to " + to);
        } catch (Exception e) {
            System.out.println("SMTP Error: " + e.getMessage());
            logMockEmail(to, subject, text);
        }
    }

    private void logMockEmail(String to, String subject, String text) {
        System.out.println("================= MOCK EMAIL SERVICE =================");
        System.out.println("To: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Body:\n" + text);
        System.out.println("======================================================");
    }
}
