FROM maven:3.9.4-eclipse-temurin-21-alpine as build-stage

WORKDIR /app

COPY pom.xml .


COPY src ./src

RUN mvn clean install



FROM openjdk:21-jdk

WORKDIR /app

COPY --from=build-stage /app/target/victory-square-0.0.1-SNAPSHOT.jar victory-square-0.0.1-SNAPSHOT.jar

EXPOSE 9003

ENTRYPOINT ["java", "-jar", "./victory-square-0.0.1-SNAPSHOT.jar"]