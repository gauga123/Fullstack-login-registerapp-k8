pipeline {
    agent any

    tools {
        nodejs "node-local"   // This makes Jenkins use your configured NodeJS installation
    }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('DockerHub-Creds')
        GITHUB_CREDENTIALS = credentials('Github-creds')
        FRONTEND_IMAGE = 'levanduc2/frontend'
        BACKEND_IMAGE = 'levanduc2/backend'
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    credentialsId: 'Github-creds',
                    url: 'https://github.com/gauga123/Fullstack-login-registerapp-k8'
            }
        }

        stage('Build Frontend App') {
            steps {
                dir('frontend') {
                    sh """
                        npm install
                        npm run build
                        docker build --no-cache -t ${env.FRONTEND_IMAGE}:latest .
                    """
                }
            }
        }

        stage('Build Backend App') {
            steps {
                dir('backend') {
                    sh """
                        npm install
                        docker build --no-cache -t ${env.BACKEND_IMAGE}:latest .
                    """
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'DockerHub-Creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${env.FRONTEND_IMAGE}:latest
                        docker push ${env.BACKEND_IMAGE}:latest
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh """
                        microk8s kubectl apply -f k8s/db/
                        microk8s kubectl apply -f k8s/backend/
                        microk8s kubectl apply -f k8s/frontend/
                        microk8s kubectl apply -f k8s/ingress.yaml

			# 🔄 Restart deployments so pods pull the latest image
                        microk8s kubectl rollout restart deployment frontend-deployment
                        microk8s kubectl rollout restart deployment backend-deployment
                        microk8s kubectl rollout restart statefulset/postgres 
              		# ⏳ Wait until updates are done
                        microk8s kubectl rollout status deployment/frontend-deployment
                        microk8s kubectl rollout status deployment/backend-deployment
                        microk8s kubectl rollout status statefulset/postgres
                    """
                }
            }
        }
    }

    post {
        always {
            sh """
                docker rmi ${env.FRONTEND_IMAGE}:latest || true
                docker rmi ${env.BACKEND_IMAGE}:latest || true
                docker image prune -f || true
            """
        }
    }
}
