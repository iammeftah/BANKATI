package com.example.notification_service.messaging;

import com.example.notification_service.model.Notification;
import com.example.notification_service.service.NotificationService;
import org.springframework.stereotype.Service;

@Service
public class NotificationListener {

    private final NotificationService notificationService;

    public NotificationListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Si vous utilisez RabbitMQ, vous pouvez laisser cette méthode annotée avec @RabbitListener.
    // Sinon, remplacez la logique pour un autre type d'écouteur ou de communication interservices.
    public void handleNotification(NotificationEvent event) {
        if (event == null) {
            System.err.println("Notification event is null!");
            return;
        }

        System.out.println("Received notification event: " + event);

        Notification notification = new Notification();
        notification.setUserId(event.getUserId());
        notification.setMessage(event.getMessage());

        // Sauvegarde de la notification dans la base de données
        notificationService.saveNotification(notification);
    }
}
