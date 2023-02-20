FROM node:18 as build

WORKDIR /app

COPY package*.json ./

COPY .npmrc .

#Was a lot of errors SOCKET TIMEOUT - that's why I use next commands

RUN set -eux; apt-get install curl;

RUN npm config set fetch-retries 5
RUN npm config set fetch-retry-mintimeout 600000
RUN npm config set fetch-retry-maxtimeout 1200000
RUN npm config set fetch-timeout 1800000

RUN npm ci --maxsockets 4

FROM node:18-alpine
COPY --from=build /app /app
WORKDIR /app
COPY . .
RUN npm install -D prisma

CMD ["npm", "run", "start:app"]
