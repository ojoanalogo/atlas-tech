FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

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

ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm generate:importmap
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
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/scripts/migrate.mjs ./scripts/migrate.mjs

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "node scripts/migrate.mjs && node server.js"]
