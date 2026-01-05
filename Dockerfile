# ----------- Build stage -----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first (better caching)
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source
COPY . .

# Build TypeScript
RUN npm run build


# ----------- Runtime stage -----------
FROM node:20-alpine

WORKDIR /app

# Copy only what we need from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# App runs on this port
EXPOSE 3001

# Start the app
CMD ["node", "dist/server.js"]
