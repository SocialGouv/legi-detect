FROM node:12-alpine

WORKDIR /app

COPY . .

RUN yarn --frozen-lockfile

WORKDIR /app/packages/api

ENTRYPOINT ["yarn", "start"]