FROM maven:3.9.5-eclipse-temurin-21
WORKDIR /app

COPY pom.xml ./
COPY src ./src

RUN mvn clean install -DskipTests
EXPOSE 8761

CMD ["mvn", "spring-boot:run"]

