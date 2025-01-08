package com.example.notification_service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@PropertySource("file:.env")
public class NotificationServiceApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(NotificationServiceApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// Logique de démarrage de l'application ici si nécessaire
		System.out.println("Notification Service démarré avec succès !");
	}
}
