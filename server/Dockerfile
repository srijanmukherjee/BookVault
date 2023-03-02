FROM node:19-alpine

WORKDIR /app

COPY package.json .

RUN yarn

EXPOSE 8000 5555

CMD [ "yarn", "dev" ]