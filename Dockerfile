# syntax=docker/dockerfile:1

FROM node:lts-alpine AS builder
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./

# Add PostgreSQL client and ts-node
RUN apk add --no-cache postgresql-client
RUN npm install -g ts-node typescript

RUN npm install --only=production
COPY --from=builder /src/.next ./.next
COPY --from=builder /src/src ./src
COPY --from=builder /src/prisma ./prisma
COPY --from=builder /src/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /src/migrations ./prisma/migrations

# Copy the entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
