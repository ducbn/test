#Stage 1: base
FROM node:20-alpine AS base
WORKDIR /app

#stagw 2: cài dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci

#stage 3: build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

#stage 4: production
FROM nginx:stable-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]