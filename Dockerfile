FROM node as builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY src ./src
COPY tsconfig.json ./
RUN yarn build

FROM node:slim
ENV NODE_ENV production
USER node
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3000
CMD [ "node", "dist/api.js" ]
