# Use a minimal base image
FROM node:16.15.0-alpine3.15@sha256:bb776153f81d6e931211e3cadd7eef92c811e7086993b685d1f40242d486b9bb

# Set the working directory to the app directory
WORKDIR /app

COPY package.json .

# Install the dependencies
#RUN apk add --no-cache nodejs npm
#RUN #npm install

# Copy the application code into the container

RUN npm config set fetch-retry-mintimeout 60000
RUN npm config set fetch-retry-maxtimeout 840000
RUN npm config set fetch-timeout 1200000
RUN npm install -g npm@latest
RUN npm install -g @nestjs/cli
RUN ["npm", "install"]

COPY . .

CMD ["npm", "run", "start:dev"]
