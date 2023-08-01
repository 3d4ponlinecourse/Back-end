FROM node:latest

WORKDIR /app

COPY . .

ENV DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public"
ENV REDIS_URL="redis://localhost:6379"

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

EXPOSE 8000/TCP

CMD ["node", "dist/index.js"]
