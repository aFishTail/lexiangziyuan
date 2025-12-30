# Lenjoy Manager

一个基于 Django + Next.js 的现代化全栈 Web 应用，采用前后端分离架构，支持 Docker 一键部署。

## 🚀 快速开始

### Windows 用户
```powershell
.\deploy.ps1
```

### Linux/macOS 用户
```bash
chmod +x deploy.sh
./deploy.sh
```

部署完成后访问：
- **前端**: http://localhost
- **后端 API**: http://localhost/api  
- **管理后台**: http://localhost/admin
- **API 文档**: http://localhost/swagger

> 📖 详细说明请查看 [快速开始文档](QUICKSTART.md)

## ✨ 特性

- 🎨 **现代化前端**: 使用 Next.js 15 + React 19 + TypeScript
- 🚀 **高性能后端**: Django 5.1 + Django REST Framework
- 🐳 **Docker 部署**: 完整的容器化解决方案，一键部署
- 📱 **响应式设计**: 支持多设备访问
- 🔒 **安全可靠**: HTTPS 支持，完善的安全配置

## 🏗️ 技术栈

### 后端
- Python 3.12
- Django 5.1.7
- Django REST Framework 3.16
- MySQL 8.0
- Gunicorn + Gevent

### 前端
- Next.js 15.5.6
- React 19.1
- TypeScript 5
- TailwindCSS 4
- React Query

### 部署
- Docker & Docker Compose
- Nginx 1.25
- Let's Encrypt SSL

## 📦 项目结构

```
lenjoy-new/
├── api/                    # Django 后端
│   ├── article/           # 文章管理
│   ├── category/          # 分类管理
│   ├── resource_website/  # 资源网站
│   ├── tag/               # 标签管理
│   ├── search/            # 搜索功能
│   └── config/            # Django 配置
├── frontend/              # Next.js 前端
│   ├── app/              # 应用页面
│   ├── components/       # UI 组件
│   └── lib/              # 工具库
├── nginx/                 # Nginx 配置
│   └── nginx.conf        # 主配置文件
├── docker-compose.yml    # Docker 编排
├── .env.example          # 环境变量模板
└── README.md             # 项目说明
```

## 🚀 快速开始

### 前置要求

- Docker 20.10+
- Docker Compose 2.0+
- 至少 4GB 可用内存

### 部署步骤

1. **克隆项目**
```bash
git clone https://github.com/aFishTail/lexiangziyuan.git
cd lenjoy-manager
```

2. **配置环境变量**
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，至少修改以下配置：
# - SECRET_KEY（Django 密钥）
# - DATABASE_PASSWORD（数据库密码）
# - DATABASE_ROOT_PASSWORD（数据库 root 密码）
```

3. **创建必要目录**
```bash
mkdir -p logs/nginx logs/mysql api/media api/staticfiles letsencrypt
```

4. **启动服务**
```bash
# 构建并启动所有服务
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

5. **访问应用**
- 前端: http://localhost
- 后端 API: http://localhost/api
- 后端管理: http://localhost/admin

### 创建管理员账户

```bash
docker-compose exec api python manage.py createsuperuser
```

## 🔧 常用命令

### 服务管理
```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f [service_name]
```

### 数据库管理
```bash
# 运行数据库迁移
docker-compose exec api python manage.py migrate

# 创建迁移文件
docker-compose exec api python manage.py makemigrations

# 备份数据库
docker-compose exec db mysqldump -u root -p lenjoy > backup.sql

# 恢复数据库
docker-compose exec -T db mysql -u root -p lenjoy < backup.sql
```

### 开发调试
```bash
# 进入后端容器
docker-compose exec api sh

# 进入前端容器
docker-compose exec frontend sh

# 进入数据库
docker-compose exec db mysql -u root -p
```

## 🌐 生产环境部署

### 1. 配置域名和 SSL

编辑 `nginx/nginx.conf`：
- 取消注释 HTTPS 配置部分
- 修改 `server_name` 为你的域名
- 配置 SSL 证书路径

### 2. 获取 SSL 证书

```bash
# 使用 Let's Encrypt
sudo certbot certonly --standalone -d your-domain.com
```

### 3. 更新环境变量

编辑 `.env`：
```bash
DEBUG=False
SECRET_KEY=your-very-long-random-secret-key
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
NEXT_PUBLIC_CLIENT_API_URL=https://your-domain.com/api
```

### 4. 重新部署

```bash
docker-compose down
docker-compose up -d --build
```

详细部署说明请查看 [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)

## 📝 API 文档

启动服务后访问：
- Swagger UI: http://localhost/api/swagger/
- ReDoc: http://localhost/api/redoc/

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👥 作者

- GitHub: [@aFishTail](https://github.com/aFishTail)

## 🔗 相关链接

- [API 文档](./api/API_DOCUMENTATION.md)
- [Docker 部署指南](./DOCKER_DEPLOYMENT.md)
- [前端集成指南](./frontend/API_INTEGRATION.md)
- [Nginx 配置说明](./nginx/README.md)
