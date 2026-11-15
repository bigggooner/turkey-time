# syntax=docker/dockerfile:1

FROM node:19-bullseye
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 1621
CMD [ "node", "index.js" ]
