FROM node:22-slim AS base
# Prisma relies on OpenSSL
RUN apt-get update -y && apt-get install -y openssl

FROM base AS dependencies

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

# Install ALL dependencies (including dev) to run build and prisma generate
RUN npm install

FROM base AS build

WORKDIR /usr/src/app

COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Generate Prisma Client
# Copy .env.example to .env so Prisma can validate the schema using the dummy connection string
RUN cp .env.example .env
RUN npx prisma generate

# Build the app
RUN npm run build

# Remove dev dependencies
RUN npm prune --prod

FROM gcr.io/distroless/nodejs22-debian12 AS deploy

WORKDIR /usr/src/app

# Copy necessary files
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/prisma ./prisma

EXPOSE 4000

CMD ["dist/index.js"]
