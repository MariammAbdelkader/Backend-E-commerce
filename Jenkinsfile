pipeline {
    agent any

    environment {
        IMAGE_NAME = "mariammohamed1112/backend-app"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'make build'  
                sh 'docker images'  // Verify if the image was built correctly
            }
        }

        //stage('Run Tests') {
           // steps {
                //echo 'Running Tests...'
            //}
       // }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
                sh 'docker images'  // List images to verify
                sh "docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:latest"  // Tag the image
                sh "docker push ${IMAGE_NAME}:latest"  // Push the image
            }
        }

        stage('Deploy Application') {
            steps {
                sh './deploy.sh'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
        }
    }
}
