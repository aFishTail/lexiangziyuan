# Debian 12（Bookworm）服务器部署指南（Docker + Node.js）

适用场景：

- 后端（MySQL + Django + Nginx）使用 Docker Compose
- 前端 Next.js 在宿主机用 Node.js 运行（避免部分 Next.js 版本在容器/生产模式下的问题）

> 说明：本文按「版本较新」优先，Docker 用官方仓库安装；Node.js 推荐 NodeSource 安装 **Node 22 LTS**（如你有兼容性顾虑，也可改用 Node 20 LTS）。

---

## 0. 服务器准备

建议：Debian 12 x64、2C4G 起步、开放 80/443（以及你需要的 SSH 端口）。

登录服务器后先做基础更新：

```bash
sudo apt update
sudo apt -y upgrade
sudo apt -y install ca-certificates curl gnupg git
```

（可选）设置时区：

```bash
sudo timedatectl set-timezone Asia/Shanghai
```

---

## 1. 安装 Docker（官方仓库，版本较新）

### 1.1 清理旧版本（如果安装过）

```bash
sudo apt -y remove docker docker-engine docker.io containerd runc || true
```

### 1.2 添加 Docker 官方 APT 仓库

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
```

### 1.3 安装 Docker Engine + Compose v2

```bash
sudo apt -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

启动并设置开机自启：

```bash
sudo systemctl enable --now docker
```

验证版本：

```bash
docker --version
docker compose version
```

### 1.4（推荐）免 sudo 使用 docker

```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

## 2. 安装 Node.js（推荐 Node 22 LTS）

### 2.1 使用 NodeSource 安装 Node 22

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt -y install nodejs
```

验证版本：

```bash
node -v
npm -v
```

### 2.2 安装 pnpm（推荐用 Corepack）

```bash
sudo corepack enable
corepack prepare pnpm@latest --activate
pnpm -v
```

> 如果你想固定 pnpm 版本，也可以把 `latest` 换成 `9.14.2` 之类的具体版本。

---

## 3. 拉取项目并配置环境变量

```bash
cd /opt
sudo mkdir -p lenjoy
sudo chown -R $USER:$USER /opt/lenjoy

cd /opt/lenjoy
git clone <你的仓库地址> lxiangziyuan
cd lxiangziyuan
```

创建 `.env`（如果不存在）：

```bash
cp .env.example .env 2>/dev/null || true
```

编辑 `.env`（至少修改这些）：

- `SECRET_KEY`
- `DATABASE_PASSWORD`
- `DATABASE_ROOT_PASSWORD`
- （如果有域名）`ALLOWED_HOSTS`、Nginx server_name 等

---

## 4. 后端一键启动（Docker Compose）

```bash
chmod +x deploy.sh
./deploy.sh
```

查看状态：

```bash
docker compose ps
```

查看日志：

```bash
docker compose logs -f --tail=200
```

---

## 5. 创建 Django 超级用户

后端容器启动后执行：

```bash
docker compose exec api python manage.py createsuperuser
```

然后可访问：

- `http://你的服务器IP/admin/`

---

## 6. 启动前端（宿主机 Node.js）

进入前端目录：

```bash
cd /opt/lenjoy/lxiangziyuan/frontend
```

安装依赖（首次需要）：

```bash
pnpm install
```

构建 + 启动：

```bash
pnpm build
pnpm start
```

默认会监听：

- `http://localhost:3000`

---

## 7. 关键点：Linux 上 `host.docker.internal` 解析

你的 Nginx 配置里 upstream 指向：

- `host.docker.internal:3000`

在 Linux 上，Docker 默认**不会**提供该域名。项目里已在 `docker-compose.yml` 的 `nginx` 服务加入：

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

应用方式：

```bash
docker compose up -d
# 或者仅重启 nginx
docker compose restart nginx
```

> 如果你的 Docker 版本太旧不支持 `host-gateway`，备选方案是把 Nginx upstream 改成宿主机网桥网关 IP（常见为 `172.17.0.1:3000`）。

---

## 8. 端口与防火墙（UFW 示例）

如果你启用了 UFW：

```bash
sudo apt -y install ufw
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

---

## 9. 安装 HTTPS 证书（Let’s Encrypt / Certbot，推荐）

这一套方案特点：

- Nginx 在 Docker 容器内
- 证书文件保存在宿主机 `./letsencrypt`（已挂载到容器 `/etc/letsencrypt`）
- 使用 `certbot/certbot` 容器通过 **webroot** 模式签发证书

### 9.1 前置条件

- 你有域名，比如 `example.com`、`www.example.com`
- 域名 A 记录已解析到这台服务器公网 IP
- 服务器安全组 / 防火墙已放通 **80** 和 **443**

### 9.2 准备 ACME 校验目录

在项目根目录（`/opt/lenjoy/lxiangziyuan`）创建目录：

```bash
cd /opt/lenjoy/lxiangziyuan
mkdir -p certbot/www letsencrypt
```

重启 nginx 使挂载与配置生效：

```bash
docker compose up -d
docker compose restart nginx
```

### 9.3 修改 Nginx 的域名（server_name）

编辑 `nginx/nginx.conf`：

- 把 `server_name localhost;` 改成你的域名（建议同时写主域名和 www）：
  - `server_name example.com www.example.com;`
- 如果你要强制跳转 HTTPS，可以把文件里注释的“HTTP强制跳转HTTPS”那段 server 取消注释，并把域名改成你的域名。

改完后执行：

```bash
docker compose exec nginx nginx -t
docker compose restart nginx
```

### 9.4 申请证书（HTTP-01）

在项目根目录执行（把域名与邮箱改成你自己的）：

```bash
cd /opt/lenjoy/lxiangziyuan

docker run --rm \
  -v "$PWD/certbot/www:/var/www/certbot" \
  -v "$PWD/letsencrypt:/etc/letsencrypt" \
  certbot/certbot certonly \
  --webroot -w /var/www/certbot \
  -d example.com -d www.example.com \
  --email you@example.com \
  --agree-tos \
  --no-eff-email
```

成功后，你会在宿主机看到：

- `./letsencrypt/live/<你的域名>/fullchain.pem`
- `./letsencrypt/live/<你的域名>/privkey.pem`

### 9.5 启用 HTTPS（443 server）

`nginx/nginx.conf` 里已经有一段注释的 HTTPS server 模板：

- 取消注释
- 改 `server_name`
- 改 `ssl_certificate` 和 `ssl_certificate_key` 路径为你实际域名目录

然后重启 Nginx：

```bash
docker compose exec nginx nginx -t
docker compose restart nginx
```

验证：

```bash
curl -I https://example.com
```

### 9.6 自动续期（cron）

Let’s Encrypt 证书默认 90 天有效，建议设置每天定时续期（续期成功时才会真正更新）。

编辑 root 的 crontab：

```bash
sudo crontab -e
```

添加一行（每天凌晨 3 点）：

```bash
0 3 * * * cd /opt/lenjoy/lxiangziyuan && docker run --rm -v "$PWD/certbot/www:/var/www/certbot" -v "$PWD/letsencrypt:/etc/letsencrypt" certbot/certbot renew --webroot -w /var/www/certbot --quiet && docker compose exec -T nginx nginx -s reload
```

---

## 10. 访问与自检

### 9.1 自检接口

```bash
curl -i http://127.0.0.1/api/health/
```

### 9.2 对外访问

- 前端（经 Nginx）：`http://<服务器IP>/`
- 后端 API：`http://<服务器IP>/api/`
- Admin：`http://<服务器IP>/admin/`
- Swagger：`http://<服务器IP>/swagger/`

如果你启用了 HTTPS：

- 前端：`https://<你的域名>/`
- 后端：`https://<你的域名>/api/`
- Admin：`https://<你的域名>/admin/`

---

## 11. 常见问题

### 10.1 Nginx 显示 unhealthy

通常是 Nginx healthcheck 请求 `http://localhost:80` 返回 502/404 导致。

- 确认后端容器健康：`docker compose ps`
- 如果你使用混合部署，确保前端 `pnpm start` 正在运行且监听 3000

### 10.2 前端 API 请求丢了 `/api`

如果前端打印出类似 `http://localhost/categories`，检查前端 API 拼接逻辑：

- 确保构建 URL 时不要让 `/categories` 这种以 `/` 开头的 path 覆盖 base path（`/api`）
- 推荐约定：`apiFetch("/categories/")` 这类 path 统一由封装层做清洗/拼接

---

## 12. （可选）让前端常驻运行

推荐方案：用 **PM2** 托管 Next.js 进程（自动重启、日志管理、开机自启）。

### 12.1 安装 PM2

```bash
sudo npm i -g pm2
pm2 -v
```

### 12.2 以 PM2 启动前端

先确保前端能正常 build：

```bash
cd /opt/lenjoy/lxiangziyuan/frontend
pnpm install
pnpm build
```

用 PM2 启动 `pnpm start`：

```bash
cd /opt/lenjoy/lxiangziyuan/frontend
pm2 start pnpm --name lenjoy-frontend -- start
```

查看状态与日志：

```bash
pm2 status
pm2 logs lenjoy-frontend
```

### 12.3 设置开机自启（systemd）

生成 systemd 服务并开机启动（按提示执行那条 sudo 命令）：

```bash
pm2 startup
```

保存当前进程列表（很关键）：

```bash
pm2 save
```

### 12.4 常用维护命令

```bash
# 重启
pm2 restart lenjoy-frontend

# 停止
pm2 stop lenjoy-frontend

# 删除
pm2 delete lenjoy-frontend

# 查看详细信息
pm2 describe lenjoy-frontend
```

### 12.5 更新发布（代码更新后）

```bash
cd /opt/lenjoy/lxiangziyuan
git pull

cd frontend
pnpm install
pnpm build
pm2 restart lenjoy-frontend
```

---

如果你告诉我：

- 你要用域名还是纯 IP
- 是否要启用 HTTPS（Let’s Encrypt）

我可以把 Nginx 的生产配置（含证书续期）也写成一套可直接执行的步骤。
