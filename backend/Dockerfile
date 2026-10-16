# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.14.1 --activate

# Install the monorepo workspaces from their manifests and shared lockfile.
FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
COPY backend/package.json ./backend/package.json
COPY my-app/package.json ./my-app/package.json
RUN yarn install --immutable

# This target is also used by Docker Compose to run Prisma migrations.
FROM deps AS build
COPY . .
WORKDIR /app/backend
RUN DIRECT_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
    DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
    yarn prisma generate

# Keep only the backend workspace in the runtime image.
FROM deps AS runtime-deps
RUN yarn workspaces focus backend

FROM base AS runtime
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
WORKDIR /app/backend
COPY --from=runtime-deps /app/node_modules /app/node_modules
COPY --from=build /app/backend/src ./src
COPY --from=build /app/backend/package.json ./package.json

USER node
EXPOSE 3000
CMD ["node", "--import=tsx", "src/main.ts"]
