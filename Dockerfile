FROM node:latest

WORKDIR /app

COPY . .

ARG APP_VERSION
ENV APP_VERSION=${APP_VERSION:-"develop"}

ARG FROM_REPO
ENV FROM_REPO=${FROM_REPO:-"https://github.com/3d4ponlinecourse/Back-end"}

ENV DATABASE_URL="postgresql://postgres:3dsecret@localhost:5432/postgres?schema=public"
ENV REDIS_URL="redis://redis-cli:6379"

RUN npm i 
RUN npm run prisma
RUN npm run build

EXPOSE 8000/TCP

CMD ["node", "dist/index.js", ]
