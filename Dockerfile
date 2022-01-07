FROM node:16-alpine

WORKDIR .

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/bin/www.js" ]
