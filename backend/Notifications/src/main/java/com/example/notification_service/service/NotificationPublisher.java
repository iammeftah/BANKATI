package com.example.notification_service.service;

import com.example.notification_service.messaging.NotificationEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NotificationPublisher {

    private final RestTemplate restTemplate;

    @Value("${auth.service.url}")
    private String authServiceUrl;

    public NotificationPublisher(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendNotification(NotificationEvent event) {
        if (event == null) {
            System.err.println("Notification event is null. Event not sent.");
            return;
        }
        try {
            // Envoi de la notification au service Authentification via REST API
            restTemplate.postForObject(authServiceUrl + "/api/auth/notifications", event, Void.class);
            System.out.println("Notification event sent to Authentication Service: " + event);
        } catch (Exception e) {
            System.err.println("Failed to send notification event: " + e.getMessage());
        }
    }
}
