# Lenjoy Manager - Docker 一键部署指南

本指南将帮助你使用 Docker 快速部署 Lenjoy Manager 项目（前后端分离架构）。

## 📋 前置要求

- Docker 20.10 或更高版本
- Docker Compose 2.0 或更高版本
- 至少 4GB 可用内存
- 至少 10GB 可用磁盘空间

### 安装 Docker

#### Windows / macOS
下载并安装 [Docker Desktop](https://www.docker.com/products/docker-desktop)

#### Linux
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

## 🚀 快速开始

### 1. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，修改以下关键配置：
# - SECRET_KEY: Django 密钥（必须修改）
# - DATABASE_PASSWORD: 数据库密码（建议修改）
# - DATABASE_ROOT_PASSWORD: 数据库 root 密码（建议修改）
# - NEXT_PUBLIC_CLIENT_API_URL: 浏览器访问的 API 地址
```

### 2. 一键部署

#### Linux / macOS
```bash
chmod +x deploy.sh
./deploy.sh
```

#### Windows (PowerShell)
```powershell
.\deploy.ps1
```

### 3. 访问应用

- **前端**: http://localhost
- **后端 API**: http://localhost/api
- **后端管理后台**: http://localhost/admin

## 📁 项目结构

```
lenjoy-new/
├── docker-compose.yml          # Docker Compose 主配置
├── .env.example               # 环境变量模板
├── .env                       # 环境变量配置（需自行创建）
├── deploy.sh                  # Linux/macOS 部署脚本
├── deploy.ps1                 # Windows 部署脚本
├── nginx/                     # Nginx 配置（外层）
│   ├── nginx.conf            # Nginx 主配置
│   └── README.md             # Nginx 配置说明
├── logs/                      # 日志目录
│   └── nginx/                # Nginx 日志
├── letsencrypt/              # SSL 证书目录
├── api/                       # 后端项目
│   ├── Dockerfile            # 后端 Dockerfile
│   ├── requirements.txt      # Python 依赖
│   ├── manage.py            # Django 管理脚本
│   ├── media/               # 媒体文件
│   └── staticfiles/         # 静态文件
└── frontend/                  # 前端项目
    ├── Dockerfile.frontend   # 前端 Dockerfile
    ├── package.json         # Node.js 依赖
    └── next.config.ts       # Next.js 配置
```

## 🔧 常用命令

### 查看服务状态
```bash
docker-compose ps
```

### 查看服务日志
```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f api        # 后端日志
docker-compose logs -f frontend   # 前端日志
docker-compose logs -f nginx      # Nginx 日志
docker-compose logs -f db         # 数据库日志
```

### 重启服务
```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart api
docker-compose restart frontend
```

### 停止服务
```bash
# 停止所有服务（保留数据）
docker-compose down

# 停止所有服务并删除数据卷
docker-compose down -v
```

### 重新构建并启动
```bash
docker-compose up -d --build
```

### 进入容器
```bash
# 进入后端容器
docker-compose exec api sh

# 进入前端容器
docker-compose exec frontend sh

# 进入数据库容器
docker-compose exec db bash
```

## 🔨 数据库管理

### 创建超级用户
```bash
docker-compose exec api python manage.py createsuperuser
```

### 运行数据库迁移
```bash
docker-compose exec api python manage.py migrate
```

### 备份数据库
```bash
docker-compose exec db mysqldump -u root -p lenjoy > backup_$(date +%Y%m%d).sql
```

### 恢复数据库
```bash
docker-compose exec -T db mysql -u root -p lenjoy < backup_20240101.sql
```

## 🌐 生产环境部署

### 1. 修改环境变量

编辑 `.env` 文件：

```bash
# 安全配置
DEBUG=False
SECRET_KEY=your-very-long-random-secret-key-here
DATABASE_PASSWORD=strong-password-here
DATABASE_ROOT_PASSWORD=strong-root-password-here

# 域名配置
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
NEXT_PUBLIC_CLIENT_API_URL=https://your-domain.com/api
```

### 2. 配置 SSL 证书

#### 使用 Let's Encrypt
```bash
# 安装 certbot
sudo apt-get install certbot

# 获取证书
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# 证书路径将在: /etc/letsencrypt/live/your-domain.com/
```

#### 更新 Nginx 配置
编辑 `nginx/nginx.conf`：

1. 取消注释 HTTPS 服务器配置块
2. 取消注释 HTTP 到 HTTPS 重定向
3. 修改域名为你的实际域名
4. 确保证书路径正确：
```nginx
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
```

详细配置说明请参考 `nginx/README.md`

### 3. 更新证书挂载（如果使用主机证书）

如果证书在主机上，修改 `docker-compose.yml` 中的 nginx 卷挂载：
```yaml
nginx:
  volumes:
    - /etc/letsencrypt:/etc/letsencrypt:ro  # 挂载主机证书目录
```

### 4. 部署
```bash
./deploy.sh
# 选择选项 1 进行全新部署
```

## 🐛 故障排查

### 服务无法启动
```bash
# 查看详细日志
docker-compose logs

# 检查端口占用
netstat -tunlp | grep -E '80|443|3000|8000|3306'
```

### 数据库连接失败
```bash
# 检查数据库健康状态
docker-compose ps db

# 查看数据库日志
docker-compose logs db

# 测试数据库连接
docker-compose exec db mysql -u root -p
```

### 前端无法访问后端 API
1. 检查环境变量 `NEXT_PUBLIC_API_URL` 和 `NEXT_PUBLIC_CLIENT_API_URL`
2. 检查 Nginx 配置中的代理设置
3. 查看 Nginx 日志：`docker-compose logs nginx`

### 静态文件无法加载
```bash
# 重新收集静态文件
docker-compose exec api python manage.py collectstatic --noinput
```

### 容器内存不足
编辑 `docker-compose.yml`，添加资源限制：
```yaml
services:
  api:
    deploy:
      resources:
        limits:
          memory: 1G
```

## 📊 监控和维护

### 查看资源使用情况
```bash
docker stats
```

### 清理未使用的资源
```bash
# 清理未使用的镜像
docker image prune -a

# 清理未使用的卷
docker volume prune

# 清理所有未使用的资源
docker system prune -a
```

### 定期备份
建议设置定时任务（cron）进行数据库备份：
```bash
# 添加到 crontab
0 2 * * * cd /path/to/project && docker-compose exec -T db mysqldump -u root -pYOUR_PASSWORD lenjoy > backups/db_$(date +\%Y\%m\%d).sql
```

## 🔒 安全建议

1. ✅ 修改默认的数据库密码
2. ✅ 使用强随机字符串作为 SECRET_KEY
3. ✅ 生产环境设置 DEBUG=False
4. ✅ 配置防火墙，仅开放必要端口（80, 443）
5. ✅ 定期更新 Docker 镜像
6. ✅ 使用 HTTPS（配置 SSL 证书）
7. ✅ 定期备份数据库
8. ✅ 限制容器资源使用

## 📞 支持

如有问题，请：
1. 查看日志：`docker-compose logs`
2. 检查服务状态：`docker-compose ps`
3. 参考本文档的故障排查部分

## 📝 更新日志

- 2024-11-24: 初始版本，支持前后端分离一键部署
