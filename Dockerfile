# ---- Build stage ----
    FROM maven:3.9-eclipse-temurin-21 AS build

    WORKDIR /app
    
    # Copy the entire repo into the container
    COPY . .
    
    # Go into the backend module folder
    WORKDIR /app/services/ticket-booking-system
    
    # Build the Spring Boot jar
    RUN mvn -B clean package -DskipTests
    
    # ---- Run stage ----
    FROM eclipse-temurin:21-jre
    
    WORKDIR /app
    
    # Copy the built jar from the build stage
    COPY --from=build /app/services/ticket-booking-system/target/*.jar app.jar
    
    EXPOSE 8080
    
    # Use Render's $PORT env, default to 8080 if missing
    CMD ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
    