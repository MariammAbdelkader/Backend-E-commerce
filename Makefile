# Specify Docker image name for the Backend
IMAGE_NAME=my-backend-app

# Build the Docker image using Dockerfile
build:
	docker build -t $(IMAGE_NAME) .

# Run the Docker container using docker-compose
up:
	docker-compose up --build

# Stop and remove the Docker container using docker-compose
down:
	docker-compose down

# Clean up unused Docker images and containers
clean:
	docker system prune -f

# Restart the container (stop, build, and run again using docker-compose)
restart:
	make down
	make up
