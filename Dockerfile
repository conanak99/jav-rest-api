FROM node:10.15.3-alpine
WORKDIR /usr/src/app
COPY . .
RUN yarn
ENV USE_CACHE=true
CMD ["yarn", "start"]

