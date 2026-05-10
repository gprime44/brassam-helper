# Étape 1 : Build
FROM eclipse-temurin:25-jdk-alpine AS build
WORKDIR /app

# Copie des fichiers de configuration Gradle
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

# Téléchargement des dépendances (cache)
RUN ./gradlew --no-daemon dependencies

# Copie du code source et build
COPY src src
RUN ./gradlew --no-daemon build -x test

# Étape 2 : Run
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Création d'un utilisateur non-root pour la sécurité
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copie du jar depuis l'étape de build
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
