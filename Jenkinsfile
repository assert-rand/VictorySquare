pipeline {
    environment{
        docker_image = ""
    }
    agent any
    stages {
        stage('Stage 1 : Cloning the Git Repository') {
            steps {
                git branch: 'main',
                url: 'https://github.com/assert-rand/VictorySquare.git'
             
            }
        }
        stage('Stage 2 : Build Docker Image') {
            steps {
                script{
                    dir('./victory-square-authentication-service') {
                        retry(5) {
                            docker_image1 = docker.build "todorokishotoua15/auth"
                        }
                    }
                    dir('./victory-square-eureka-server') {
                        retry(5) {
                            docker_image2 = docker.build "todorokishotoua15/eureka-server"
                        }
                    }
                    dir('./victory-square-frontend') {
                        retry(5) {
                            docker_image3 = docker.build "todorokishotoua15/victorysq-frontend"
                        }
                    }
                    dir('./victory-square-gateway') {
                        retry(5) {
                            docker_image4 = docker.build "todorokishotoua15/gateway"
                        }
                    }
                    dir('./victory-square-game-service') {
                        retry(5) {
                            docker_image5 = docker.build "todorokishotoua15/game-service"
                        }
                    }
                    dir('./Database') {
                        retry(5) {
                            docker_image6 = docker.build "todorokishotoua15/database"
                        }
                    }
                }
            }
        }
        stage('Stage 3 : Push Docker image to hub') {
            steps{
                script{
                    retry(5) {
                        docker.withRegistry('', 'DockerHubCred') {
                            docker_image1.push()
                            docker_image2.push()
                            docker_image3.push()
                            docker_image4.push()
                            docker_image5.push()
                            docker_image6.push()
                        }
                    }
                }
            }
        }
        stage('Step 4: Ansible Deployment') {
            steps{
                ansiblePlaybook becomeUser: null,
                colorized: true,
                credentialsId: 'localhost',
                disableHostKeyChecking: true,
                installation: 'Ansible',
                inventory: '.deployment/inventory.ini',
                playbook: '.deployment/deploy.yml',
                sudoUser: null
            }
        }
    }
}