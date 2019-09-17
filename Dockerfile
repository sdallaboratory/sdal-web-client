FROM trion/ng-cli as build

WORKDIR /app
COPY . .
RUN ng build --prod

FROM nginx

WORKDIR /app
COPY --from=build ./ /usr/share/nginx/html


