# 快速启动指南

## 环境要求

- Python 3.8+
- Django 5.1.7
- Django REST Framework 3.16.0
- 数据库：SQLite（开发）/ MySQL（生产）

## 安装步骤

### 1. 安装依赖
```bash
pip install -r requirements.txt
```

### 2. 配置环境变量

创建 `.env` 文件（参考 `.env.example`）：

```env
DEBUG=True
USE_SQLITE=True

# MySQL配置（如果不使用SQLite）
DATABASE_ENGINE=django.db.backends.mysql
DATABASE_NAME=lenjoy_manager
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306

# JWT配置
JWT_ACCESS_TOKEN_LIFETIME_DAYS=30
JWT_REFRESH_TOKEN_LIFETIME_DAYS=365
```

### 3. 数据库迁移

```bash
# 创建迁移文件
python manage.py makemigrations

# 应用迁移
python manage.py migrate
```

### 4. 创建超级用户

```bash
python manage.py createsuperuser
```

### 5. 收集静态文件（生产环境）

```bash
python manage.py collectstatic
```

### 6. 启动开发服务器

```bash
python manage.py runserver
```

服务器启动后，访问：
- API 文档（Swagger）: http://localhost:8000/swagger/
- Admin 后台: http://localhost:8000/admin/

## 功能说明

### 已实现的功能

✅ **统一响应格式**
- 所有 API 返回统一的 JSON 格式
- 统一的异常处理

✅ **文章管理**
- 文章列表（分页、过滤）
- 按分类过滤
- 按标签过滤
- 文章详情
- 热门文章
- 随机推荐

✅ **分类管理**
- 分类列表
- 树形分类结构
- 支持父子分类

✅ **标签管理**
- 标签列表
- 标签搜索

✅ **资源网站管理**（新增）
- 资源网站列表（分页、过滤）
- 按分类过滤
- 推荐网站
- 热门网站

✅ **资源网站分类**（新增）
- 分类管理

✅ **全局搜索**
- 搜索文章（支持分页）
- 按标题、内容、备注搜索

✅ **JWT 认证**
- Token 获取
- Token 刷新
- Token 验证

## API 端点总览

### 认证
- `POST /api/token/` - 获取 Token
- `POST /api/token/refresh/` - 刷新 Token
- `POST /api/token/verify/` - 验证 Token

### 文章
- `GET /api/articles/` - 文章列表
- `GET /api/articles/{id}/` - 文章详情
- `POST /api/articles/` - 创建文章（需认证）
- `GET /api/articles/hot/` - 热门文章
- `GET /api/articles/random/` - 随机推荐

### 分类
- `GET /api/categories/` - 分类列表
- `GET /api/categories/{id}/` - 分类详情
- `GET /api/categories/tree/` - 分类树
- `GET /api/categories/sub_categories/` - 二级分类

### 标签
- `GET /api/tags/` - 标签列表
- `GET /api/tags/{id}/` - 标签详情

### 资源网站
- `GET /api/resources/websites/` - 资源网站列表
- `GET /api/resources/websites/{id}/` - 资源网站详情
- `POST /api/resources/websites/` - 创建资源网站（需认证）
- `GET /api/resources/websites/featured/` - 推荐网站
- `GET /api/resources/websites/hot/` - 热门网站

### 资源分类
- `GET /api/resources/categories/` - 资源分类列表
- `GET /api/resources/categories/{id}/` - 资源分类详情

### 搜索
- `GET /api/search/?keyword=xxx` - 文章搜索（支持分页）

## 测试 API

### 使用 Swagger UI
访问 http://localhost:8000/swagger/ 进行交互式测试

### 使用 curl

#### 获取文章列表
```bash
curl http://localhost:8000/api/articles/
```

#### 按分类过滤
```bash
curl "http://localhost:8000/api/articles/?category=1"
```

#### 搜索
```bash
curl "http://localhost:8000/api/search/?keyword=python&page=1&page_size=20"
```

#### 获取 Token（需要先创建用户）
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

#### 使用 Token 创建文章
```bash
curl -X POST http://localhost:8000/api/articles/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试文章",
    "content": "文章内容",
    "category_name": "Python",
    "tag_names": ["编程", "教程"]
  }'
```

## 项目结构

```
lenjoy-manager/
├── common/                    # 公共模块
│   ├── response.py           # 统一响应
│   ├── exceptions.py         # 统一异常处理
│   ├── pagination.py         # 自定义分页
│   ├── renderers.py          # 自定义渲染器
│   └── search_views.py       # 全局搜索
├── article/                  # 文章模块
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── filters.py
│   └── urls.py
├── category/                 # 分类模块
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── tag/                      # 标签模块
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── resource_website/         # 资源网站模块（新增）
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── filters.py
│   ├── urls.py
│   └── admin.py
└── config/                   # 项目配置
    ├── settings.py
    ├── urls.py
    └── wsgi.py
```

## 常见问题

### Q: 如何修改分页大小？
A: 在请求中添加 `page_size` 参数，例如：`/api/articles/?page_size=50`

### Q: 如何只获取已发布的内容？
A: 默认情况下，非管理员用户只能看到已发布的内容（status=1）

### Q: 如何添加自定义过滤条件？
A: 修改对应模块的 `filters.py` 文件

### Q: 响应格式可以自定义吗？
A: 可以修改 `common/response.py` 和 `common/renderers.py`

## 部署建议

### 生产环境配置

1. 设置 `DEBUG=False`
2. 使用 MySQL 数据库
3. 配置 ALLOWED_HOSTS
4. 使用 gunicorn + nginx
5. 配置 CORS（如果需要）
6. 配置 HTTPS

### Docker 部署（如果需要）

项目已包含 `Dockerfile` 和 `docker-compose.yml`

```bash
docker-compose up -d
```

## 下一步开发

- [ ] 添加文章点赞功能
- [ ] 添加评论系统
- [ ] 添加用户系统
- [ ] 添加文件上传限制
- [ ] 添加缓存机制
- [ ] 添加 API 限流
- [ ] 添加更多测试用例

## 技术支持

如有问题，请参考：
- Django 官方文档: https://docs.djangoproject.com/
- DRF 官方文档: https://www.django-rest-framework.org/
- API 文档: 查看 API_DOCUMENTATION.md
