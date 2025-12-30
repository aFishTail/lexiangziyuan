# Lenjoy Manager - 快速开始 🚀

一个基于 Django + Next.js 的内容管理系统，支持 Docker 一键部署。

## 📦 快速部署

### 前置要求
- Docker 20.10+
- Docker Compose 2.0+

### Windows 系统

```powershell
# 1. 一键部署
.\deploy.ps1

# 2. 访问应用
# 前端: http://localhost
# 后端 API: http://localhost/api
# 管理后台: http://localhost/admin
```

### Linux/macOS 系统

```bash
# 1. 添加执行权限
chmod +x deploy.sh

# 2. 一键部署
./deploy.sh

# 3. 访问应用
# 前端: http://localhost
# 后端 API: http://localhost/api
# 管理后台: http://localhost/admin
```

## 🔧 常用命令

```bash
# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f              # 所有服务
docker compose logs -f api          # 后端日志
docker compose logs -f frontend     # 前端日志
docker compose logs -f nginx        # Nginx日志

# 重启服务
docker compose restart

# 停止服务
docker compose down

# 停止并删除数据
docker compose down -v
```

## ⚙️ 环境配置

首次部署会自动创建 `.env` 文件，**强烈建议修改以下配置**：

```env
# Django 密钥（必须修改）
SECRET_KEY=your-secret-key-here

# 数据库密码（建议修改）
DATABASE_PASSWORD=your-password
DATABASE_ROOT_PASSWORD=your-root-password

# 允许的主机（生产环境请设置具体域名）
ALLOWED_HOSTS=*

# 浏览器访问的 API 地址
NEXT_PUBLIC_CLIENT_API_URL=http://localhost/api
```

生成 Django SECRET_KEY：
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

## 📊 服务架构

```
┌─────────────┐
│   Nginx     │  ← 80/443 端口
│  (反向代理)  │
└──────┬──────┘
       │
   ┌───┴────┬──────────────┐
   │        │              │
   ▼        ▼              ▼
┌──────┐ ┌─────────┐  ┌─────────┐
│ Next │ │ Django  │  │  MySQL  │
│  js  │ │   API   │  │   DB    │
└──────┘ └─────────┘  └─────────┘
```

## 📁 项目结构

```
.
├── api/                    # Django 后端
│   ├── Dockerfile         # 后端镜像配置
│   ├── requirements.txt   # Python 依赖
│   └── manage.py         # Django 管理脚本
├── frontend/              # Next.js 前端
│   ├── Dockerfile        # 前端镜像配置
│   └── package.json      # Node.js 依赖
├── nginx/                 # Nginx 配置
├── docker-compose.yml     # Docker Compose 配置
├── .env.example          # 环境变量模板
├── deploy.sh             # Linux/macOS 部署脚本
└── deploy.ps1            # Windows 部署脚本
```

## 🐛 故障排查

### 服务启动失败

```bash
# 查看具体错误信息
docker compose logs api
docker compose logs frontend

# 完全重新构建
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

### 数据库连接失败

检查 `.env` 中的数据库配置是否正确，确保：
- `DATABASE_NAME`、`DATABASE_USER`、`DATABASE_PASSWORD` 配置一致
- 等待数据库完全启动（首次启动约需1-2分钟）

### 端口被占用

修改 `.env` 文件中的端口配置：
```env
HTTP_PORT=8080    # 默认 80
HTTPS_PORT=8443   # 默认 443
```

## 📚 更多文档

- [Docker 详细部署指南](DOCKER_DEPLOYMENT.md)
- [API 文档](api/API_DOCUMENTATION.md)
- [前端集成文档](frontend/API_INTEGRATION.md)

## 🆘 获取帮助

如遇问题，请检查：
1. Docker 和 Docker Compose 版本是否符合要求
2. 端口 80、443、3306 是否被占用
3. 磁盘空间是否充足（至少 10GB）
4. `.env` 配置是否正确

---

**享受使用 Lenjoy Manager！** 🎉
