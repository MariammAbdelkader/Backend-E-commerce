# the base image
FROM node:18-alpine

# working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# install all dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]

