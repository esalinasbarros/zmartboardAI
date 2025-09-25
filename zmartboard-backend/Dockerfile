# Base image
FROM node:22-alpine AS base
WORKDIR /usr/src/app
COPY package*.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases
COPY prisma ./prisma/

# Dependencies stage (installs all dependencies, including dev)
FROM base AS dependencies
RUN corepack enable
RUN yarn install
RUN yarn prisma generate

# Builder stage (builds the app for production)
FROM dependencies AS builder
COPY . .
# It's often good to run prisma generate again here if schema could have changed
# or if the builder stage needs its own client for some reason during build.
# If not, this could be omitted if the one from 'dependencies' is sufficient.
RUN yarn prisma generate
RUN yarn build

# Development stage
FROM dependencies AS development
WORKDIR /usr/src/app
# Copy prisma client and schema from the dependencies stage
COPY --from=dependencies /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=dependencies /usr/src/app/prisma ./prisma
# Copy all source files for watch mode and volume mounting
COPY . .
EXPOSE ${PORT:-3000}
# The command will be yarn start:dev from docker-compose.yml

# Production stage (optimized for production)
FROM base AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json yarn.lock ./
RUN corepack enable
RUN yarn install --frozen-lockfile --production
COPY --from=builder /usr/src/app/dist ./dist
# This copies the prisma directory (schema and migrations) from the builder stage
COPY --from=builder /usr/src/app/prisma ./prisma
# This copies the generated client from the builder stage
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
# The following line is removed as /usr/src/app/prisma (which includes schema.prisma)
# was already copied from the builder stage, ensuring consistency.
# COPY prisma/schema.prisma ./prisma/schema.prisma
EXPOSE ${PORT:-3000}
CMD ["node", "dist/main.js"]
