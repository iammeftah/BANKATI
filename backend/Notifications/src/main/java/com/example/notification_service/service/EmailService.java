package com.example.notification_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String text) {
        logger.info("Attempting to send email to: {}", to);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            message.setFrom("ourakhismail@gmail.com"); // Replace with your Gmail address
            logger.debug("Email message created");

            mailSender.send(message);
            logger.info("E-mail envoyé avec succès à : {}", to);
        } catch (MailException e) {
            logger.error("Erreur lors de l'envoi de l'e-mail à : {}", to, e);
            throw e; // Re-throw the exception to be handled by the controller
        }
    }
}

