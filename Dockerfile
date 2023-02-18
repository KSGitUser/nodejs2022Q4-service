# Use a minimal base image
FROM node:18-alpine

# Set the working directory to the app directory
WORKDIR /app

COPY package*.json .
COPY .npmrc .

#Was a lot of errors SOCKET TIMEOUT - that's why I use next commands

RUN set -eux; apk add curl;

RUN npm config set fetch-retries 5
RUN npm config set fetch-retry-mintimeout 600000
RUN npm config set fetch-retry-maxtimeout 1200000
RUN npm config set fetch-timeout 1800000
RUN ["npm", "ci", "--maxsockets", "4"]

COPY . .

CMD ["npm", "run", "start:app"]
