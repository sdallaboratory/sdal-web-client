FROM trion/ng-cli:8.3.8 as build

COPY . /app

USER root
RUN npm install

# RUN addgroup app && adduser --system --ingroup app app
# USER app
RUN ng build --prod 
#--base-href=/touch/ --deploy-url=/touch/

FROM nginx:1.17.4

COPY default.conf /etc/nginx/conf.d/
COPY --from=build /app/dist/touch /usr/share/nginx/html


