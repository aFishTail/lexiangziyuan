# Docker 部署指南 - 前后端分离版本

## 项目架构

本项目采用前后端分离架构：
- **后端**: Django REST API (Python)
- **前端**: Next.js (React)
- **数据库**: MySQL 8.0
- **Web服务器**: Nginx
- **容器化**: Docker + Docker Compose

## 目录结构

```
lenjoy-manager/              # 后端项目
├── docker-compose.yml       # Docker编排配置
├── Dockerfile               # 后端Dockerfile
├── Dockerfile.frontend      # 前端Dockerfile模板
├── nginx/
│   ├── nginx.conf          # 原有nginx配置（仅后端）
│   └── nginx.frontend.conf # 新nginx配置（前后端）
└── ...

lenjoy-frontend/            # 前端项目（需在另一个目录）
├── Dockerfile              # 从Dockerfile.frontend复制
└── ...
```

## 部署前准备

### 1. 准备前端项目

将 `Dockerfile.frontend` 复制到你的 Next.js 项目根目录并重命名为 `Dockerfile`：

```powershell
# 假设前端项目在 ../lenjoy-frontend
Copy-Item Dockerfile.frontend ..\lenjoy-frontend\Dockerfile
```

### 2. 修改 Next.js 配置

在前端项目的 `next.config.js` 中添加：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // 必需：启用standalone模式
  // 其他配置...
}

module.exports = nextConfig
```

### 3. 配置环境变量

在后端项目根目录创建 `.env` 文件：

```env
# 数据库配置
DATABASE_NAME=lenjoy_db
DATABASE_USER=lenjoy_user
DATABASE_PASSWORD=your_strong_password_here

# Django密钥
SECRET_KEY=your_secret_key_here

# 可选：如果需要特定的API URL
# API_BASE_URL=https://www.lxziyuan.com/api
```

### 4. 更新 docker-compose.yml

修改 `frontend` 服务的 `context` 路径，指向你的前端项目：

```yaml
frontend:
  build:
    context: ../lenjoy-frontend  # 修改为实际路径
    dockerfile: Dockerfile
```

## 一键部署

### 首次部署

```powershell
# 1. 构建并启动所有服务
docker-compose up -d --build

# 2. 查看服务状态
docker-compose ps

# 3. 查看日志
docker-compose logs -f
```

### 后续更新

```powershell
# 仅更新后端
docker-compose up -d --build api

# 仅更新前端
docker-compose up -d --build frontend

# 更新所有服务
docker-compose up -d --build
```

## 服务访问

- **前端**: https://www.lxziyuan.com
- **后端API**: https://www.lxziyuan.com/api
- **Django Admin**: https://www.lxziyuan.com/admin
- **媒体文件**: https://www.lxziyuan.com/media

## 常用命令

### 服务管理

```powershell
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 重启特定服务
docker-compose restart api
docker-compose restart frontend

# 查看实时日志
docker-compose logs -f api
docker-compose logs -f frontend
```

### 数据库操作

```powershell
# 进入Django容器执行迁移
docker-compose exec api python manage.py migrate

# 创建超级用户
docker-compose exec api python manage.py createsuperuser

# 进入MySQL容器
docker-compose exec db mysql -u lenjoy_user -p
```

### 调试

```powershell
# 进入后端容器
docker-compose exec api sh

# 进入前端容器
docker-compose exec frontend sh

# 查看Nginx配置
docker-compose exec nginx cat /etc/nginx/nginx.conf

# 重载Nginx配置
docker-compose exec nginx nginx -s reload
```

## 本地开发模式

如果你想在本地开发时使用Docker：

```yaml
# 在 docker-compose.yml 中为 api 服务添加：
volumes:
  - .:/app  # 挂载源码以实现热重载

# 为 frontend 服务添加：
volumes:
  - ../lenjoy-frontend:/app
  - /app/node_modules
  - /app/.next
command: npm run dev  # 使用开发模式
environment:
  - NODE_ENV=development
```

## SSL证书配置

### 使用 Let's Encrypt

```powershell
# 1. 停止nginx
docker-compose stop nginx

# 2. 申请证书（在宿主机上）
# 需要先安装certbot
certbot certonly --standalone -d www.lxziyuan.com

# 3. 证书会保存在 ./letsencrypt/live/www.lxziyuan.com/

# 4. 重启nginx
docker-compose start nginx
```

### 证书续期

```powershell
# 自动续期
certbot renew

# 续期后重载nginx
docker-compose exec nginx nginx -s reload
```

## 故障排查

### 前端无法连接后端API

1. 检查环境变量是否正确设置
2. 检查CORS配置
3. 查看容器日志：`docker-compose logs api`

### Nginx 502 错误

1. 检查upstream服务是否运行：`docker-compose ps`
2. 检查网络连接：`docker-compose exec nginx ping api`
3. 查看Nginx日志：`docker-compose logs nginx`

### 数据库连接失败

1. 等待数据库健康检查完成（约10-30秒）
2. 检查数据库凭据
3. 查看数据库日志：`docker-compose logs db`

## 性能优化建议

1. **启用Gzip压缩**（已在nginx配置中）
2. **配置CDN**：将静态资源上传到CDN
3. **数据库优化**：
   - 定期备份数据库
   - 监控慢查询
4. **容器资源限制**：
   ```yaml
   services:
     api:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 1G
   ```

## 备份与恢复

### 数据库备份

```powershell
# 备份
docker-compose exec db mysqldump -u lenjoy_user -p lenjoy_db > backup.sql

# 恢复
docker-compose exec -T db mysql -u lenjoy_user -p lenjoy_db < backup.sql
```

### 媒体文件备份

```powershell
# 备份
tar -czf media_backup.tar.gz ./media

# 恢复
tar -xzf media_backup.tar.gz
```

## 监控与日志

### 日志位置

- Nginx日志: `./logs/nginx/`
- Django日志: `./logs/`
- Docker日志: `docker-compose logs`

### 监控建议

1. 使用 Prometheus + Grafana 监控容器
2. 配置日志聚合（如ELK Stack）
3. 设置健康检查告警

## 安全建议

1. **不要提交 .env 文件到Git**
2. **定期更新依赖**：
   ```powershell
   pip list --outdated  # Python
   npm outdated         # Node.js
   ```
3. **使用强密码**
4. **定期更新SSL证书**
5. **启用防火墙规则**
6. **定期审计容器镜像**

## 生产环境检查清单

- [ ] 修改所有默认密码
- [ ] 设置 DEBUG=False
- [ ] 配置正确的 ALLOWED_HOSTS
- [ ] 启用HTTPS
- [ ] 配置SSL证书自动续期
- [ ] 设置数据库定期备份
- [ ] 配置日志轮转
- [ ] 限制容器资源使用
- [ ] 配置监控和告警
- [ ] 测试容器自动重启

## 支持

如有问题，请查看：
1. Docker日志：`docker-compose logs`
2. 容器状态：`docker-compose ps`
3. 网络连接：`docker network inspect lenjoy-manager_lenjoy-network`
