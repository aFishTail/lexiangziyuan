# Docker Compose 一键运行使用说明

## ✅ 已完成的配置

项目已经配置好 Docker Compose 一键部署，包含以下内容：

### 1. 服务配置
- **MySQL 8.0** - 数据库服务
- **Django API** - 后端服务（Python 3.12）
- **Next.js Frontend** - 前端服务（Node 20）
- **Nginx** - 反向代理和静态文件服务

### 2. 健康检查
所有服务都配置了健康检查，确保服务正确启动后才开始接受请求。

### 3. 一键部署脚本
- `deploy.ps1` - Windows PowerShell 脚本
- `deploy.sh` - Linux/macOS Bash 脚本

## 🚀 如何使用

### Windows 用户

1. 打开 PowerShell（管理员权限）
2. 进入项目目录
3. 运行部署脚本：

```powershell
.\deploy.ps1
```

### Linux/macOS 用户

1. 打开终端
2. 进入项目目录
3. 添加执行权限并运行：

```bash
chmod +x deploy.sh
./deploy.sh
```

## 📝 脚本会自动执行以下操作

1. ✅ 检查 Docker 和 Docker Compose 是否安装
2. ✅ 如果没有 `.env` 文件，从 `.env.example` 创建
3. ✅ 创建必要的目录（logs、media、staticfiles 等）
4. ✅ 停止并清理旧容器
5. ✅ 构建 Docker 镜像
6. ✅ 启动所有服务
7. ✅ 显示服务状态和访问地址

## 🌐 访问地址

部署成功后，可以通过以下地址访问：

- **前端应用**: http://localhost
- **后端 API**: http://localhost/api
- **管理后台**: http://localhost/admin
- **API 文档**: http://localhost/swagger
- **Redoc 文档**: http://localhost/redoc

## ⚙️ 环境变量配置

首次运行会自动创建 `.env` 文件，**强烈建议修改以下配置**：

```env
# Django 密钥（必须修改！）
SECRET_KEY=your-secret-key-here

# 数据库密码（建议修改）
DATABASE_PASSWORD=your-secure-password
DATABASE_ROOT_PASSWORD=your-secure-root-password

# 允许的主机（生产环境请设置具体域名）
ALLOWED_HOSTS=*
```

生成随机的 Django SECRET_KEY：
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

## 📋 常用命令

```bash
# 查看所有服务状态
docker compose ps

# 查看所有服务日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f api        # 后端
docker compose logs -f frontend   # 前端
docker compose logs -f db         # 数据库
docker compose logs -f nginx      # Nginx

# 重启所有服务
docker compose restart

# 重启特定服务
docker compose restart api

# 停止所有服务（保留数据）
docker compose down

# 停止并删除所有数据
docker compose down -v

# 进入容器 shell
docker compose exec api bash       # 后端容器
docker compose exec frontend sh    # 前端容器
docker compose exec db bash        # 数据库容器
```

## 🔧 Django 管理命令

```bash
# 创建超级用户
docker compose exec api python manage.py createsuperuser

# 执行数据库迁移
docker compose exec api python manage.py migrate

# 收集静态文件
docker compose exec api python manage.py collectstatic

# 进入 Django shell
docker compose exec api python manage.py shell
```

## 🐛 故障排查

### 1. 端口被占用

如果 80 端口被占用，可以修改 `.env` 中的端口配置：

```env
HTTP_PORT=8080
```

然后重启服务：
```bash
docker compose down
docker compose up -d
```

### 2. 数据库连接失败

- 等待数据库完全启动（首次启动需要 1-2 分钟）
- 检查 `.env` 中的数据库配置是否正确
- 查看数据库日志：`docker compose logs db`

### 3. 前端或后端构建失败

完全重新构建：
```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

### 4. 查看详细错误信息

```bash
# 查看特定服务的详细日志
docker compose logs --tail=100 api
docker compose logs --tail=100 frontend

# 实时跟踪日志
docker compose logs -f api
```

## 📊 服务依赖关系

```
MySQL (db)
  ↓
Django API (api)
  ↓
Next.js Frontend (frontend)
  ↓
Nginx (反向代理)
```

- Nginx 等待 API 和 Frontend 健康后启动
- API 等待数据库健康后启动
- Frontend 等待 API 启动后启动

## 💡 生产环境部署建议

1. **修改 SECRET_KEY**：使用随机生成的密钥
2. **修改数据库密码**：使用强密码
3. **配置域名**：在 `.env` 中设置 `ALLOWED_HOSTS`
4. **启用 HTTPS**：修改 `nginx/nginx.conf`，启用 HTTPS 配置
5. **配置 SSL 证书**：使用 Let's Encrypt 或其他证书
6. **禁用 DEBUG**：在 `.env` 中设置 `DEBUG=False`
7. **配置备份**：定期备份 MySQL 数据和媒体文件

## 📚 更多文档

- [完整部署文档](DOCKER_DEPLOYMENT.md)
- [快速开始](QUICKSTART.md)
- [API 文档](api/API_DOCUMENTATION.md)
- [前端文档](frontend/API_INTEGRATION.md)

---

**祝您使用愉快！** 🎉
