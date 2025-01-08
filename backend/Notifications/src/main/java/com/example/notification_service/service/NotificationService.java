package com.example.notification_service.service;

import com.example.notification_service.model.Notification;
import com.example.notification_service.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    public NotificationService(NotificationRepository notificationRepository, EmailService emailService) {
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
    }

    public Notification saveNotification(Notification notification) {
        logger.info("Saving notification: {}", notification);

        // Save the notification to the database
        Notification savedNotification = notificationRepository.save(notification);

        // Send an email notification
        try {
            emailService.sendEmail(
                    notification.getEmail(),
                    "New Notification", // Email subject
                    notification.getMessage() // Email message
            );
            logger.info("Email sent successfully to {}", notification.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send email: {}", e.getMessage());
        }

        return savedNotification;
    }

    public List<Notification> getAllNotifications() {
        logger.info("Fetching all notifications");
        return notificationRepository.findAll();
    }
}