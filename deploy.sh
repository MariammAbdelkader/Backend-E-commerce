
# Stop and remove the existing container
docker stop backend-app || true
docker rm backend-app || true

# Pull the latest image
docker pull mariammohamed1112/backend-app:latest

# Run the container
docker run -d -p 3000:3000 --name backend-app mariammohamed1112/backend-app:latest

