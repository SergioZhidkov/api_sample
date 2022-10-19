FROM node:17.9.0

WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 8086
CMD ["yarn", "run", "dev"]