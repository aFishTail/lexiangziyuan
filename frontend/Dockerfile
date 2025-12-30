# 第一阶段：依赖安装
FROM node:20-alpine AS deps

# 安装必要的依赖
RUN apk add --no-cache libc6-compat

WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package.json pnpm-lock.yaml* ./

# 安装 pnpm 并安装依赖
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate
RUN pnpm install --no-frozen-lockfile

# 第二阶段：运行
FROM node:20-alpine AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# 安装必要的运行时依赖
RUN apk add --no-cache libc6-compat

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 复制所有文件（使用开发模式）
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs . .

# 确保 nextjs 用户有写入权限
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 使用开发模式启动（避免生产构建的 bug）
CMD ["node_modules/.bin/next", "dev"]
