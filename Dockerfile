FROM node:12-alpine as builder

WORKDIR /app

COPY . .

RUN yarn --frozen-lockfile

WORKDIR /app/packages/api

RUN yarn build

FROM node:12-alpine

WORKDIR /app

COPY --from=builder /app/packages/api/build/index.js /app


ENTRYPOINT ["node", "index"]
