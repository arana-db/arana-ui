FROM node as builder

WORKDIR /var/www

COPY ./ /var/www

RUN yarn && yarn build

FROM nginx

COPY ./nginx/ /etc/nginx/conf.d/

COPY --from=builder /var/www/dist /usr/share/nginx/html

EXPOSE 9000
