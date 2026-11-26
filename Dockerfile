FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime

ENV NODE_ENV=production \
    PORT=3001

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY server.ts ./server.ts
COPY server ./server
COPY src/lib/routineGuidance.ts ./src/lib/routineGuidance.ts

USER node

EXPOSE 3001

CMD ["node", "--import", "tsx", "server.ts"]
