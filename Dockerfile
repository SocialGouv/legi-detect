FROM node:12-alpine as builder

WORKDIR /app

COPY ./package.json .
COPY ./lerna.json .
COPY ./yarn.lock .
ADD ./packages ./packages

RUN yarn --frozen-lockfile

WORKDIR /app/packages/api

RUN yarn build

FROM node:12-alpine

WORKDIR /app

COPY --from=builder /app/packages/api/build/index.js /app
COPY --from=builder /app/packages/legi-detect/data /data

ENTRYPOINT ["node", "index"]
