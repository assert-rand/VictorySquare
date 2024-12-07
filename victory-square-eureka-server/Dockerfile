FROM maven:3.9.4-eclipse-temurin-21-alpine as build-stage

WORKDIR /app

COPY pom.xml .
# RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean install


# Run the java application
FROM openjdk:21-jdk

WORKDIR /app

COPY --from=build-stage /app/target/victory-square-eureka-server.jar victory-square-eureka-server.jar

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "./victory-square-eureka-server.jar"]