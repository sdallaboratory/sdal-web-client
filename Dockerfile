FROM trion/ng-cli as build

COPY . /app

RUN npm install
RUN ng build --prod

FROM nginx

# COPY default.conf /etc/nginx/conf.d/
COPY --from=build /app/dist/touch /usr/share/nginx/html


