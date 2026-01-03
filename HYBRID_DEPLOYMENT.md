# 混合部署方案说明

本项目采用混合部署方案，更加灵活和稳定：

## 📦 架构说明

### Docker 容器部署（后端服务）
- **MySQL 8.0** - 数据库
- **Django API** - 后端 API 服务
- **Nginx** - 反向代理

### 本地 Node.js 部署（前端服务）
- **Next.js 15** - 前端应用（生产模式）

## 🚀 部署步骤

### 1. 启动后端服务（Docker）

#### Windows
```powershell
.\deploy.ps1
```

#### Linux/macOS
```bash
chmod +x deploy.sh
./deploy.sh
```

### 2. 启动前端服务（本地 Node.js）

```bash
cd frontend

# 安装依赖（首次运行）
pnpm install

# 生产模式
pnpm build
pnpm start

# 或开发模式（支持热更新）
pnpm dev
```

## 🌐 访问地址

启动所有服务后：

- **前端**: http://localhost （Nginx 代理到 localhost:3000）
- **后端 API**: http://localhost/api
- **管理后台**: http://localhost/admin
- **API 文档**: http://localhost/swagger
- **直接访问 Next.js**: http://localhost:3000

## ✅ 优势

### 相比纯 Docker 部署

1. **避免 Next.js 15 Docker Bug** - 绕过了生产构建的已知问题
2. **性能更好** - Next.js 生产模式，而非开发模式
3. **热更新支持** - 开发时可以使用 `pnpm dev`，修改立即生效
4. **构建更快** - 不需要每次都重新构建 Docker 镜像
5. **调试更方便** - 可以直接在 IDE 中调试 Next.js 代码
6. **资源占用小** - 减少一个 Docker 容器

### 相比纯本地部署

1. **环境一致性** - 后端和数据库运行在容器中，环境标准化
2. **部署简单** - 后端一键启动，无需配置数据库和 Python 环境
3. **隔离性好** - 数据库和后端服务与本机环境隔离

## 📋 常用命令

### 后端服务（Docker）

```bash
# 查看状态
docker compose ps

# 查看日志
docker compose logs -f api
docker compose logs -f nginx

# 重启服务
docker compose restart

# 停止服务
docker compose down
```

### 前端服务（Node.js）

```bash
cd frontend

# 开发模式（热更新）
pnpm dev

# 生产模式
pnpm build
pnpm start

# 查看构建产物
ls -la .next

# 清理构建
rm -rf .next
pnpm build
```

## 🔧 环境变量配置

### 后端（.env）

```env
DATABASE_NAME=lenjoy
DATABASE_USER=lenjoy
DATABASE_PASSWORD=Lenjoy123!@#
DATABASE_HOST=db
DATABASE_PORT=3306
```

### 前端（frontend/.env.local）

```env
# 浏览器访问的 API 地址
NEXT_PUBLIC_API_URL=http://localhost/api

# 服务端渲染时访问的 API 地址（可选）
NEXT_INTERNAL_API_URL=http://localhost:8000/api
```

## 🐛 故障排查

### 前端无法连接后端

1. 检查后端服务是否运行：`docker compose ps`
2. 检查 Nginx 是否健康：`curl http://localhost/api/health/`
3. 检查前端环境变量：`frontend/.env.local`

### Nginx 502 错误

1. 确保 Next.js 在 3000 端口运行
2. 检查防火墙是否阻止了 3000 端口
3. Windows 用户确保 Docker Desktop 启用了 host.docker.internal

### Next.js 构建失败

```bash
cd frontend
rm -rf .next node_modules
pnpm install
pnpm build
```

## 🚢 生产环境部署

### 方案 1：全部 Docker（推荐用于服务器）

如果在 Linux 服务器上，可以使用完整的 Docker 部署：
- 降级 Next.js 到 14.x 版本
- 或等待 Next.js 15 修复相关 bug

### 方案 2：混合部署（当前方案）

适合开发环境和需要灵活调试的场景：
- 后端：Docker Compose
- 前端：PM2 或 systemd 管理 Node.js 进程

### 方案 3：完全分离部署

- 前端：Vercel / Netlify 等 Serverless 平台
- 后端：Docker + 云服务器
- 数据库：云数据库服务

## 💡 提示

- 首次启动前端需要 `pnpm build`，耗时约 1-2 分钟
- 开发时使用 `pnpm dev` 可以获得更好的开发体验
- 生产环境建议使用 `pnpm build && pnpm start`
- 可以使用 PM2 管理 Next.js 进程：`pm2 start "pnpm start" --name lenjoy-frontend`

---

**这种混合部署方案结合了 Docker 和本地部署的优势，是目前最稳定的方案！** 🎉
