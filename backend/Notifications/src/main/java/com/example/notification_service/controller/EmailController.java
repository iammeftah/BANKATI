package com.example.notification_service.controller;

import com.example.notification_service.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Replace with your frontend URL
public class EmailController {

    private static final Logger logger = LoggerFactory.getLogger(EmailController.class);
    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/send-email")
    public String sendEmail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String text
    ) {
        logger.info("Received request to send email to: {}", to);
        logger.debug("Email subject: {}", subject);
        logger.debug("Email text: {}", text);

        try {
            emailService.sendEmail(to, subject, text);
            logger.info("Email sent successfully to: {}", to);
            return "E-mail envoyé à " + to;
        } catch (Exception e) {
            logger.error("Error occurred while sending email to: {}", to, e);
            return "Erreur lors de l'envoi de l'e-mail à " + to;
        }
    }
}

