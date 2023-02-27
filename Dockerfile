FROM node:18 as build

WORKDIR /app

COPY package*.json ./

COPY .npmrc .

RUN npm ci
RUN npm rebuild bcrypt --build-from-source

COPY . .
RUN npm install -g prisma
RUN npm install -g rimraf
RUN npm install -g @nestjs/cli
RUN npm install -g node-gyp
RUN npm install bcrypt
#CMD ["npm", "run", "start:dev"]
#RUN bash -c "cp .env.example .env"
#RUN bash -c "npm run generate:prisma && npm run build && npm run && npm run start"
