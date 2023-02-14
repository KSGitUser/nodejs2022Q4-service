# Use a minimal base image
FROM node:18-alpine

# Set the working directory to the app directory
WORKDIR /app

COPY package*.json .

# Install the dependencies
#RUN apk add --no-cache nodejs npm
RUN #npm install

# Copy the application code into the container
COPY . .
