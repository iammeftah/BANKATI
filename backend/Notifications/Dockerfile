# Étape 1 : Utiliser l'image officielle de Java
FROM openjdk:17-jdk-slim

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier le fichier JAR de l'application
COPY target/notification-service-0.0.1-SNAPSHOT.jar app.jar

# Étape 4 : Exposer le port utilisé par le service (par exemple, 8095)
EXPOSE 8095

# Étape 5 : Ajouter un point d'entrée pour exécuter l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
