FROM node:current-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

COPY . .


# ARG FROM_REPO
# ENV FROM_REPO=${FROM_REPO:-"https://github.com/3d4ponlinecourse/Back-end.git"}

ENV PORT=8000
ENV POSTGRES_HOST="localhost"
ENV POSTGRES_PORT="5432"
ENV POSTGRES_PASSWORD="3dsecret"

RUN npm install
RUN npm run build


CMD ["node", "dist/index.js"]

