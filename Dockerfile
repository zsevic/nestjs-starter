FROM node:16-alpine3.11 as build_stage

RUN apk add --no-cache bash

WORKDIR /home/src

COPY package*.json ./

RUN npm ci
COPY . .

RUN npm run build

FROM node:16-alpine3.11 as app_stage

RUN mkdir -p /home/app && chown -R node:node /home/app

WORKDIR /home/app

USER node

COPY --from=build_stage /home/src/package*.json ./

RUN npm install --only=production

COPY --from=build_stage /home/src/dist ./dist/

EXPOSE 8080

CMD [ "npm", "run", "start:prod" ]
