#stage 1: base
FROM node:20-alpine AS base
WORKDIR /app

#stage 2: dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci

#stage 3: builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
# sau khi build xong, xóa devDependencies để giảm size cho stage
RUN npm prune --production && npm cache clean --force

#stage 4: run on production
FROM base AS runner

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 -G nodejs nestjs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main"]