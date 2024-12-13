Harsh Kumar (IMT2021016)
Subhajeet Lahiri (IMT2021022)

Link to the GitHub repo: https://github.com/assert-rand/VictorySquare.git

---
## 1. Overview

**VictorySquare** is a real-time, PvP, interactive chess application that enables users to connect, play, and manage games with features like secure authentication, game invitations, and dynamic gameplay. 

The architecture of VictorySquare is microservice-based, allowing the application to be developed, deployed, and scaled as independent modules. Each service is responsible for a specific functionality, and together they interact seamlessly to provide an integrated user experience. The microservices, deployed using Kubernetes for orchestration and scaling, include:

1. **victory-square-authentication-service**  
    Handles user registration, authentication, and JWT-based token validation, ensuring secure access.
    
2. **victory-square-game-service**  
    Manages game creation, state updates, and communication between players using the FEN (Forsyth–Edwards Notation) for board representation.
    
3. **victory-square-gateway**  
    Serves as the API gateway, directing user requests to appropriate services and implementing security and routing policies.
    
4. **victory-square-eureka-server**  
    Acts as a service registry, enabling efficient service discovery and interaction in the distributed microservices architecture.
    
5. **victory-square-frontend**  
    A user-facing React-based web application that provides an interactive interface for logging in, sending game invitations, and playing chess.
    
6. **Database Service**  
    Stores user information, game states, notifications, and other critical data, ensuring persistence and high availability.
    
7. **ELK Integration**  
    The **ELK Stack** (Elasticsearch, Logstash, Kibana) is integrated for centralized monitoring and logging, providing insights into application performance and user activities.

This microservice-based design enables VictorySquare to achieve modularity, scalability, and fault isolation. Each service can be independently developed, deployed, and scaled, ensuring high availability and performance under varying loads. Additionally, the use of Docker for containerization and Kubernetes for orchestration guarantees consistency across environments and simplifies the CI/CD pipeline.

---
## 2. Version Control

Version control for **VictorySquare** was managed using **Git** locally, with a public **GitHub repository** as the remote. This setup allowed for seamless collaboration and ensured proper tracking of all changes made to the codebase throughout the development process.

To support the exploration of different deployment strategies, we utilized **branching** in Git. Two diverging approaches were investigated:

1. `main`  Branch
    This branch focused on a Kubernetes-based deployment strategy. Kubernetes was used to orchestrate the micro-services, providing features like scalability, dynamic resource allocation, and fault tolerance. This branch was aligned with our goal of creating a highly scalable and production-ready architecture.
    
2. `dockercompose` Branch  
    This branch explored the use of Docker Compose for service orchestration. Docker Compose was a simpler option for local development and testing, enabling all services to run within a single networked environment. However, it lacked the scalability and advanced orchestration capabilities needed for production environments.

After evaluating both approaches, the **main branch** (Kubernetes-based deployment) was chosen for its superior scalability and alignment with the project's goals of high availability and modularity. The **dockercompose branch** was subsequently deprecated, and the repository was streamlined to focus solely on the Kubernetes deployment strategy.

![[README_images/Pasted image 20241210033156.png]]

---
## 3. CI/CD

Continuous Integration and Continuous Deployment (CI/CD) for **VictorySquare** were implemented using a **Jenkins pipeline**, automating the build, test, and deployment processes to ensure rapid and reliable delivery of updates. The pipeline was designed with the following key features:

#### a. Pipeline Project with Script Sourced from SCM

The Jenkins pipeline was configured as a **Pipeline Project**, with the pipeline script (`Jenkinsfile`) sourced directly from the **GitHub repository** using the Source Control Management (SCM) feature. This setup ensured that the build logic remained version-controlled and automatically updated as changes were made to the repository.

![[README_images/Pasted image 20241210215311.png]]
![[README_images/Pasted image 20241210215321.png]]

#### b. Git Web Hook Build Triggers

A **GitHub webhook** was configured to trigger builds automatically whenever changes were pushed to the repository. This eliminated the need for manual build initiation and ensured that all updates to the code-base were tested and deployed promptly. To facilitate this, Jenkins was exposed via `ngrok` on a public-facing port, enabling the webhook to communicate effectively with the Jenkins server.

#### c. User Management and Authorization

To enhance security and ensure resource efficiency:

- A separate **Jenkins user** was created, and all builds were run on a machine with better specifications to optimize build performance.
- User permissions were tightly controlled, allowing only authorized users to trigger or manage builds. This helped maintain a secure CI/CD environment.

![[README_images/Pasted image 20241210035312.png]]

![[README_images/Pasted image 20241210035352.png]]

This CI/CD pipeline provided a streamlined and secure workflow for integrating and deploying changes to the VictorySquare application. By automating critical processes such as builds, tests, and deployments, we minimized manual intervention and ensured the consistency and reliability of the application across all environments. 

---
## 4. Containerization 

Containerization for **VictorySquare** was implemented using **Docker**, ensuring consistency, portability, and ease of deployment across environments. Each component of the application was encapsulated within its own Docker container, isolating dependencies and simplifying the deployment process. Key aspects of the containerization strategy are outlined below:

#### a) Dockerfiles for Each Service

A **Dockerfile** was written for each microservice in the application, defining its build process, dependencies, and runtime environment. This approach ensured that all services were containerized independently, allowing modular development and deployment.

For the database, instead of using a standard MySQL base image, a **custom MySQL container** was created. This was necessary because the database required initialization with a custom data script during startup. The custom container allowed us to run the data initialization script seamlessly as part of the container's entrypoint, ensuring that the database was preloaded with required schemas and data.

Here is a sample Dockerfile for the spring-boot application Gateway
```Dockerfile

FROM maven:3.9.4-eclipse-temurin-21-alpine as build-stage
WORKDIR /app
COPY pom.xml .

COPY src ./src
RUN mvn clean install

FROM openjdk:21-jdk
WORKDIR /app
COPY --from=build-stage /app/target/victory-square-gateway-0.0.1-SNAPSHOT.jar victory-square-gateway-0.0.1-SNAPSHOT.jarDo
EXPOSE 9001
ENTRYPOINT ["java", "-jar", "./victory-square-gateway-0.0.1-SNAPSHOT.jar"]
```

Here is the Dockerfile for the SQL container : 

```Dockerfile
FROM mysql:latest

USER mysql

ENV MYSQL_ROOT_PASSWORD=root_password
ENV MYSQL_USER=todorokishoto
ENV MYSQL_PASSWORD=password
ENV MYSQL_DATABASE=victorysq

CMD ["mysqld"]

EXPOSE 3306
```

#### b) ELK Stack Containers

To implement centralized logging and monitoring, **ElasticSearch**, **Logstash**, and **Kibana** were containerized and deployed.

- **ElasticSearch**: Served as the data store for logs collected from the application.
- **Logstash**: Collected, parsed, and shipped logs from the VictorySquare services to ElasticSearch.
- **Kibana**: Provided a user-friendly dashboard for visualizing logs, enabling real-time insights into application performance and activities.

These containers worked together to provide a robust monitoring solution for VictorySquare.

#### c) Frontend Container with NGINX

The frontend application, built using React, was packaged into a container running the **NGINX** base image. NGINX was used to serve the static files of the frontend efficiently. The container was configured to proxy API requests to the appropriate backend services, ensuring seamless client-server communication.

Here is the Dockerfile for the front-end container : 

```Dockerfile 
# State 1: Build react app
FROM node:16-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN ["npm", "run", "build"]

# Stage 2: Serve built react app with nginx
FROM nginx:1.21.1-alpine as production-stage
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-stage /app/dist .
# Add the Nginx configuration to handle client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---
## 5. Configuration Management

Configuration management for **VictorySquare** was implemented using **Ansible**, ensuring a streamlined and automated deployment of the application's microservices and associated components. By defining a declarative **playbook**, the deployment process became repeatable, consistent, and efficient. Below are the key aspects of the configuration management approach:

#### Playbook Design

The Ansible playbook, named **Deployment**, was written to automate the following steps:

1. **Environment Setup**
    
    - The playbook specifies the Python interpreter to be used (`/usr/bin/python3`) and defines a working directory where Kubernetes YAML manifests are stored.
    - It ensures the necessary Kubernetes Python package is installed using `ansible.builtin.pip`.
2. **Resource Cleanup**
    
    - The playbook ensures a clean deployment environment by deleting any existing resources (e.g., database, eureka server, microservices, frontend, and ELK stack) before redeploying them. This is achieved using the **k8s** module with the `state: absent` parameter.
3. **Service Deployment**
    
    - Resources are redeployed sequentially by applying their respective Kubernetes manifests (`database.yaml`, `eureka.yaml`, `microservices.yaml`, `frontend.yaml`, and `elk.yaml`) using the **k8s** module with the `state: present` parameter.
    - Deployment pauses are included between critical steps to allow services like the database and Eureka server sufficient time to initialize and stabilize.
4. **Integration and Exposure**
    
    - The playbook integrates the **ELK stack** by deploying its components (ElasticSearch, Logstash, Kibana).
    - External services are created for the frontend and Kibana using **Minikube**, making them accessible outside the cluster.

```yaml

---
- name: Deployment
  hosts: local
  vars:
    ansible_python_interpreter: /usr/bin/python3
    dir: ~/Desktop/VictorySquare/deployment
  tasks:
  - name: "Installing kubernetes package"
    ansible.builtin.pip:
      name: kubernetes
      extra_args: --break-system-packages
        
  - name: "Delete the database if it already exists"
    k8s:
      state: absent
      namespace: default
      src: "{{dir}}/database.yaml"
  - name: "Delete the eureka server if it already exists"
    k8s:
      state: absent
      namespace: default
      src: "{{dir}}/eureka.yaml"
  - name: "Delete the microservices if it already exists"
    k8s:
      state: absent
      namespace: default
      src: "{{dir}}/microservices.yaml"
  - name: "Delete the frontend if it already exists"
    k8s:
      state: absent
      namespace: default
      src: "{{dir}}/frontend.yaml"


  - name: "Deploy database"
    k8s:
      state: present
      namespace: default
      src: "{{dir}}/database.yaml"
  - name: pause for 95 seconds and let DB initialize
    pause:
      seconds: 95
  - name: "Deploy eureka"
    k8s:
      state: present
      namespace: default
      src: "{{dir}}/eureka.yaml"
  - name: pause for 60 seconds and let DB initialize
    pause:
      seconds: 60
  - name: "Deploy microservices"
    k8s:
      state: present
      namespace: default
      src: "{{dir}}/microservices.yaml"
  - name: pause for 60 seconds and let DB initialize
    pause:
      seconds: 60

  - name: "ELK Integration"
    k8s:
      state: present
      namespace: default
      src: "{{dir}}/elk.yaml"


  - name: "Deploy frontend"
    k8s:
      state: present
      namespace: default
      src: "{{dir}}/frontend.yaml"

  - name: pause for 60 seconds and let DB initialize
    pause:
      seconds: 60

  - name: Creating external service for frontend
    shell: minikube service frontend
  
  - name: Expose kibana
    shell : minikube service kibana

```
#### Example Workflow

- **Database Deployment**: The playbook first deletes any existing database instance and then redeploys it using the `database.yaml` manifest. A 95-second pause is introduced to ensure proper initialization.
- **Microservices Deployment**: After the database and Eureka server are initialized, the microservices are deployed, allowing the backend services to communicate effectively with the database and service registry.
- **Frontend Deployment**: The React-based frontend is deployed after the backend services, ensuring the UI can interact seamlessly with the APIs.
- **ELK Integration**: The ELK stack is deployed to provide centralized logging and monitoring, and Kibana is exposed using Minikube for easy access to the logs.

---
## 6. Orchestration

Orchestration for **VictorySquare** was implemented using **Kubernetes** to manage and scale the microservices efficiently. Kubernetes allowed us to replicate a production-like cluster environment locally using **Minikube** with the `driver=docker`, enabling streamlined testing and deployment. Below is a detailed explanation of the orchestration strategy:

#### a. Database Deployment

The **database** service was deployed as a single replica, encapsulated within a Kubernetes **Deployment**. A **Service** was created to expose the MySQL database on port `3306`, ensuring it could be accessed by other microservices in the cluster.

- The database container used a custom image (`todorokishotoua15/database`) to initialize the database schema and preload data during startup.
#### b. Eureka Server Deployment

The **Eureka Server**, which functions as a service registry, was deployed as a single replica.

- A **LoadBalancer Service** was defined to expose the Eureka server on port `8761`, enabling discovery and registration of microservices within the cluster.
- This setup facilitated seamless communication between microservices by maintaining a centralized registry.
#### c. Microservices Deployment

The microservices (`Authentication`, `Game Service`, and `API Gateway`) were grouped under a single Kubernetes **Deployment** for simplicity, with each microservice running as a container in the same pod.

- A **LoadBalancer Service** was created to expose each microservice on its respective port (`9001` for authentication, `9005` for the game service, and `9003` for the API gateway).
- This design ensured that each microservice could handle specific requests while interacting efficiently with other components.

#### d. Frontend Deployment

The **frontend**, built using React, was deployed as a separate Kubernetes **Deployment**.

- The container used the `todorokishotoua15/victorysq-frontend` image and served the application using an NGINX web server.
- A **LoadBalancer Service** exposed the frontend on port `80`, allowing users to access the application interface directly.

#### e. ELK Stack Deployment

To monitor application performance and logs, the **ELK Stack** (Elasticsearch, Logstash, Kibana) was deployed:

- **Elasticsearch**: Deployed as a single-node instance with persistent data storage. A **LoadBalancer Service** exposed ports `9200` and `9300` for internal and external access.
- **Logstash**: Configured via a **ConfigMap** to collect logs from the microservices and send them to Elasticsearch.
- **Kibana**: Deployed with a **LoadBalancer Service** to provide a user-friendly interface for visualizing logs and monitoring system activity.

![[README_images/Pasted image 20241210214801.png]]

---

## 7. Monitoring and Logging

To ensure efficient monitoring and centralized logging for **VictorySquare**, we employed the **ELK Stack** (Elasticsearch, Logstash, Kibana). This stack provided a robust mechanism to collect, store, and visualize log data, enabling real-time insights into application performance and activities. Below is an overview of the logging and monitoring architecture:

#### a. Log Generation and Forwarding

The **gateway service** was designated as the central source of logs since all requests pass through it.

- The gateway utilized the **slf4j logger** to generate structured log entries for incoming requests, outgoing responses, errors, and other key events.
- Logs were forwarded to two destinations simultaneously:
    - **Console**: For immediate access during development and debugging.
    - **Logstash**: Sent over TCP to Logstash on port `4506` for centralized processing.

This setup ensured that all critical information related to user interactions and system behavior was captured effectively.
#### b. Logstash: Processing and Forwarding

**Logstash** acted as the intermediary for processing logs before forwarding them to the data store.

- It was configured to listen for incoming logs from the gateway on TCP port `4506`.
- The logs were parsed and filtered based on predefined configurations, ensuring only relevant and structured data was forwarded.
- Processed logs were sent to **Elasticsearch** on port `9200`, where they were indexed for efficient storage and retrieval.
#### c. Elasticsearch: Log Storage

**Elasticsearch** served as the central data store for all application logs.

- Logs from the gateway were indexed under the `victory-gateway*` index, allowing for structured and efficient querying.
- Elasticsearch’s scalability and fault tolerance ensured that logs were stored reliably, even under high volumes of requests.

#### d. Kibana: Log Visualization

**Kibana** provided a user-friendly interface to visualize and analyze the stored logs.

- The `victory-gateway*` index was used to create dashboards and visualizations, offering detailed insights into system behavior and user activities.
- Administrators could filter logs, identify patterns, and troubleshoot issues using the intuitive interface.

By integrating the ELK Stack into VictorySquare, we ensured comprehensive monitoring and logging, enabling reliable performance tracking and efficient troubleshooting of issues in the application.

![[README_images/Pasted image 20241209011354.png]]![[README_images/Pasted image 20241210194954.png]]
