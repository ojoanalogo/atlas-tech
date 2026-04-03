FROM node:20-alpine AS base
RUN corepack enable

# --- Dependencies ---
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# --- Build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URI
ARG SENTRY_AUTH_TOKEN
ENV DATABASE_URI=${DATABASE_URI}
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN pnpm generate:importmap
RUN npx payload migrate --force-accept-warning
RUN node scripts/migrate.mjs
RUN pnpm build

# --- Production ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/sentry.server.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/sentry.edge.config.ts ./

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r => { if (!r.ok) throw r.status }).catch(() => process.exit(1))"

CMD ["node", "server.js"]
