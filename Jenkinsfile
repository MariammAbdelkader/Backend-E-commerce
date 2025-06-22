pipeline {
    agent any

    environment {
        IMAGE_NAME            = "mariammohamed1112/backend-app"
        IMAGE_TAG             = "latest"
       //template ec2 instance
        REMOTE_HOST           = "ubuntu@3.83.42.141"
        DOCKER_COMPOSE_FOLDER = "/home/ubuntu/Backend-E-commerce"
        CHECK_URL             = "http://3.83.42.141:3000"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo ' Checking out source code...'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo ' Building Docker image...'
                sh "make build IMAGE_NAME=${IMAGE_NAME}"
                sh "docker images | grep ${IMAGE_NAME}"
            }
        }

        stage('Push Docker Image') {
            steps {
                echo 'Pushing Docker image to Docker Hub...'
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo ' Deploying to EC2...'
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'ec2-key-jenkins',
                    usernameVariable: 'SSH_USER',
                    keyFileVariable: 'SSH_KEY'
                )]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no -i $SSH_KEY $REMOTE_HOST << 'EOF'
                          set -e
                          cd ${DOCKER_COMPOSE_FOLDER}
                          echo " Stopping existing containers..."
                          docker-compose down
                          echo " Pruning unused Docker resources..."
                          docker system prune -af
                          echo " Pulling latest Docker image..."
                          docker pull ${IMAGE_NAME}:${IMAGE_TAG}
                          echo " Starting services with Docker Compose..."
                          docker-compose up -d
                          echo " Containers running:"
                          docker ps
                        EOF
                    """
                }
            }
        }

        stage('Confirm Deployment') {
            steps {
                echo ' Verifying HTTP 200 OK from the app...'
                script {
                    def code = sh(
                        script: "curl -s -o /dev/null -w \"%{http_code}\" ${CHECK_URL}",
                        returnStdout: true
                    ).trim()
                    if (code != '200') {
                        error " Expected HTTP 200 but got ${code}"
                    } else {
                        echo " App is live and responding (HTTP ${code})."
                    }
                }
            }
        }
    }

    post {
        always {
            echo ' Pipeline completed.'
        }
        success {
            echo 'Deployment succeeded!'
        }
        failure {
            echo ' Deployment failed. Check logs for details.'
        }
    }
}
