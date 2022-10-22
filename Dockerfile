FROM bitnami/git

FROM node as web_builder

WORKDIR /var/www

RUN git clone https://github.com/arana-db/arana-ui.git /var/www && yarn && yarn build

FROM nginx

COPY /var/www/nginx/ /etc/nginx/conf.d/

COPY --from=web_builder /var/www/dist /usr/share/nginx/html

EXPOSE 9000
