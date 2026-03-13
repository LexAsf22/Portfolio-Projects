package com.bench.ws.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationCode(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("CosmoChat — Password Change Verification");
        message.setText(
            "Hello,\n\n" +
            "Your verification code to change your password is:\n\n" +
            "  " + code + "\n\n" +
            "This code expires in 10 minutes.\n\n" +
            "If you did not request this, please ignore this email.\n\n" +
            "— CosmoChat"
        );
        mailSender.send(message);
    }
}