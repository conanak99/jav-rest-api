FROM node:16.13.0-alpine3.13
WORKDIR /usr/src/app
COPY . .
RUN yarn
ENV USE_CACHE=true
CMD ["yarn", "start"]

