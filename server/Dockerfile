FROM node:19-alpine

WORKDIR /app

COPY package.json .

RUN yarn

EXPOSE 8000

CMD [ "yarn", "dev" ]