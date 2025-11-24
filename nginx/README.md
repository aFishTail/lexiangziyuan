# Nginx 配置说明

## 文件说明

- `nginx.conf`: 主配置文件，包含开发和生产环境配置

## 配置模式

### 开发环境（默认）
- 监听 HTTP 80 端口
- 不使用 HTTPS
- 适合本地开发和测试

### 生产环境
需要取消注释以下部分：
1. HTTPS 服务器配置块
2. HTTP 到 HTTPS 的重定向

## 路由规则

| 路径              | 目标服务                | 说明                |
| ----------------- | ----------------------- | ------------------- |
| `/api/*`          | Django (api:8000)       | 后端 API 接口       |
| `/admin/*`        | Django (api:8000)       | Django 管理后台     |
| `/static/*`       | 静态文件                | Django/DRF 静态资源 |
| `/media/*`        | 媒体文件                | 用户上传文件        |
| `/_next/static/*` | Next.js (frontend:3000) | Next.js 静态资源    |
| `/_next/image`    | Next.js (frontend:3000) | Next.js 图片优化    |
| `/health`         | Nginx                   | 健康检查端点        |
| `/*`              | Next.js (frontend:3000) | 前端页面            |

## 生产环境配置步骤

### 1. 获取 SSL 证书

使用 Let's Encrypt：
```bash
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com
```

证书将保存在：
- 证书: `/etc/letsencrypt/live/your-domain.com/fullchain.pem`
- 私钥: `/etc/letsencrypt/live/your-domain.com/privkey.pem`

### 2. 修改配置文件

编辑 `nginx.conf`：

1. 取消注释 HTTPS 服务器配置块（第 140-236 行）
2. 取消注释 HTTP 到 HTTPS 重定向（第 34-38 行）
3. 修改域名：
   ```nginx
   server_name your-domain.com www.your-domain.com;
   ```
4. 更新证书路径（如果不同）：
   ```nginx
   ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
   ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
   ```

### 3. 更新 docker-compose.yml

确保挂载了证书目录：
```yaml
nginx:
  volumes:
    - /etc/letsencrypt:/etc/letsencrypt:ro
```

### 4. 重启服务

```bash
docker-compose restart nginx
```

## 性能优化

当前配置已包含：
- Gzip 压缩（通过 mime.types）
- 静态资源缓存（30 天 / 365 天）
- 连接复用
- SSL 会话缓存
- 合理的超时设置

## 安全配置

HTTPS 配置包含：
- TLS 1.2 和 1.3
- 强加密套件
- HSTS 头部
- XSS 保护
- 内容类型嗅探保护
- 点击劫持保护

## 故障排查

### 查看 Nginx 日志
```bash
docker-compose logs nginx
```

### 测试配置文件
```bash
docker-compose exec nginx nginx -t
```

### 重新加载配置
```bash
docker-compose exec nginx nginx -s reload
```

### 查看访问日志
```bash
tail -f api/logs/nginx/access.log
```

### 查看错误日志
```bash
tail -f api/logs/nginx/error.log
```
