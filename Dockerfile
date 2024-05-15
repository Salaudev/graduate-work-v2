FROM node:latest as builder
ENV NODE_ENV-build
WORKDIR /usr/src/app

COPY package.json

RUN yarn 

COPY ..

RUN yarn build

RUN yarn prune --production

FROM node:latest 
	ENV NODE_ENV-production
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules/ ./node_modules/
COPY --from=builder /usr/src/app/dist/ ./dist/

EXPOSE 3000

# Run the application.
CMD ["node", "dist/main"]
