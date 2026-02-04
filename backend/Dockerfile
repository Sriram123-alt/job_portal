# Multi-stage Docker build for Spring Boot application
# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copy pom.xml first to cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create uploads directory for resume storage
RUN mkdir -p /app/uploads/resumes

# Copy the jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Set JVM memory options for container
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Health check
# HEALTHCHECK disabled for Render/PaaS which assign dynamic ports
# HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
#   CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
