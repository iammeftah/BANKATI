# Étape 1 : Utiliser une image Java officielle
FROM openjdk:17-jdk-slim

# Étape 2 : Ajouter un dossier de travail
WORKDIR /app

# Étape 3 : Copier le fichier jar généré dans le conteneur
COPY target/wallet-service-0.0.1-SNAPSHOT.jar app.jar

# Étape 4 : Exposer le port utilisé par votre application
EXPOSE 8092

# Étape 5 : Définir la commande pour exécuter l'application
ENTRYPOINT ["java", "-jar", "app.jar"]