FROM node:22-alpine

RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Clean and build the application
RUN rm -rf dist && pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]
