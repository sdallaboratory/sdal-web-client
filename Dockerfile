FROM node:16-alpine as prod

WORKDIR /app/

COPY ["server/package*.json", "server/yarn.lock", "server/"]
RUN yarn install --frozen-lockfile --production --cwd=server

COPY server/dist/ server/dist/
COPY client/dist/ client/dist/

EXPOSE 80

CMD [ "yarn", "--cwd", "server", "start" ]