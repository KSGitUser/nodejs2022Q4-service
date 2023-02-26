FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

COPY .npmrc .

#Was a lot of errors SOCKET TIMEOUT - that's why I use next commands

RUN set -eux; apk add curl;

RUN npm config set fetch-retries 5
RUN npm config set fetch-retry-mintimeout 600000
RUN npm config set fetch-retry-maxtimeout 1200000
RUN npm config set fetch-timeout 1800000

RUN npm ci --maxsockets 4

COPY . .
# RUN npm install -g prisma
