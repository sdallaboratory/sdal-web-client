FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/

COPY /app/dist/touch /usr/share/nginx/html
