# Specify Docker image name of our Backend 
IMAGE_NAME=my-backend-app

# Build the Docker image
build:
    docker build -t $(IMAGE_NAME) .

# Run the Docker container
run:
    docker run -d -p 3000:3000 --name $(IMAGE_NAME) $(IMAGE_NAME)

# Stop and remove the Docker container
stop:
    docker stop $(IMAGE_NAME) && docker rm $(IMAGE_NAME)

# Clean up unused Docker images and containers
clean:
    docker system prune -f

