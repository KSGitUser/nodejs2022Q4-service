FROM node:14.20.0-alpine3.16 as node

WORKDIR /usr/src/app

COPY  package*.json ./

RUN npm install

COPY --chown=node:node ./ ./
