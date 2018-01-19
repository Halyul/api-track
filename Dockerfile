FROM node:alpine

WORKDIR /api-track

RUN apk add --no-cache git \
    && git clone https://github.com/Halyul/api-track.git /api-track \
    && npm install

CMD npm start
