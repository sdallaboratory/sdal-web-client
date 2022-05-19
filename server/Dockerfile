FROM node:16-alpine as prod

WORKDIR /app

COPY ["package*.json", "yarn.lock", "./"]
RUN yarn install --frozen-lockfile --production

COPY ./dist ./dist

CMD [ "yarn", "start" ]