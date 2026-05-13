# --- Étape finale (Utilise le JAR buildé localement via ./gradlew build) ---
# Note: Le build multi-étape est désactivé ici car le proxy SSL Nickel bloque le téléchargement de Gradle 
# dans le container sans configuration complexe du CA. 
# Utiliser le script ./scripts/build-and-push.ps1 pour un build fiable.

FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Création d'un utilisateur non-root et du dossier data
RUN addgroup -S spring && adduser -S spring -G spring \
    && mkdir data && chown spring:spring data

USER spring:spring

# On s'attend à ce que le JAR soit déjà présent dans build/libs/
COPY build/libs/helper-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
VOLUME /app/data
ENTRYPOINT ["java", "-jar", "app.jar"]
