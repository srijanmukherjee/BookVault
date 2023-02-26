FROM node:19-alpine3.17

WORKDIR /app

COPY package.json .

RUN yarn

EXPOSE 80

CMD [ "yarn", "dev" ]
