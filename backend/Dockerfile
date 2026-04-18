# syntax=docker/dockerfile:1.7

# --- Stage 1: deps (production dependencies only) ---
FROM node:20-alpine AS deps
WORKDIR /app

# Install only production deps, leverage layer caching
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# --- Stage 2: runtime ---
FROM node:20-alpine AS runtime
WORKDIR /app

# Security: run as non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Tini for proper signal handling (PID 1 problem)
RUN apk add --no-cache tini curl

# Copy production deps from deps stage
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application source
COPY --chown=nodejs:nodejs . .

USER nodejs

ENV NODE_ENV=production
ENV PORT=3021

EXPOSE 3021

# Healthcheck hits the backend /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://localhost:3021/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "index.js"]