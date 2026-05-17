FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Création d'un utilisateur non-root et du dossier data
RUN addgroup -S spring && adduser -S spring -G spring \
    && mkdir data && chown spring:spring data

USER spring:spring

# On s'attend à ce que le JAR soit déjà présent dans build/libs/
COPY build/libs/helper-*.jar app.jar

EXPOSE 8080
VOLUME /app/data
ENTRYPOINT ["java", "--enable-native-access=ALL-UNNAMED", "-Xshare:off", "-jar", "app.jar"]
