FROM trion/ng-cli as build

WORKDIR /app
COPY . .
RUN ng build --prod

FROM nginx

WORKDIR /app
COPY --from=build ./dist/touch /usr/share/nginx/html


