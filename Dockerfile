FROM node:21

ARG SUPER_USER \
    SUPER_PASSWORD \
    REDIS_HOST \
    REDIS_PORT 

ENV SUPER_USER=${SUPER_USER} \
    SUPER_PASSWORD=${SUPER_PASSWORD} \ 
    REDIS_HOST=${REDIS_HOST} \
    REDIS_PORT=${REDIS_PORT}

RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .

RUN rm yarn.lock || true
RUN rm package-lock.json || true
RUN npm install 
RUN npm run build 

EXPOSE 2567
CMD [ "node", "build/index.js" ]