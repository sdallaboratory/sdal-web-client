FROM trion/ng-cli:8.3.8 as build

COPY . /app

RUN npm install
RUN ng build --prod

FROM nginx:1.17.4

# COPY default.conf /etc/nginx/conf.d/
COPY --from=build /app/dist/touch /usr/share/nginx/html


