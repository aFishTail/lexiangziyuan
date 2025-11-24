# 前后端联调完成文档

## ✅ 已完成的修改

### 1. 环境配置
- ✅ 创建 `.env.local` 文件
- ✅ 配置后端 API 地址：`NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`

### 2. 类型定义更新 (`lib/types/content.ts`)
根据后端实际返回的数据结构，更新了所有接口定义：

**后端字段映射：**
- `title` → `name` (资源/资源标题)
- `publishedAt` → `created_time` (创建时间)
- `updatedAt` → `update_time` (更新时间)
- `excerpt` → 从 `content` HTML 中提取
- `coverImage` → `cover_img`
- `slug` → 使用 `id` 替代（后端未提供 slug）
- `categories[]` → `category` (单个分类对象)
- `addedAt` → `created_time`
- `clickCount` → `click_count`
- `isRecommended` → `is_recommended`

**新增类型：**
- `ResourceCategory` - 资源网站分类
- 所有 ID 字段从 `string` 改为 `number`

### 3. API Client 更新 (`lib/api/client.ts`)
- ✅ 处理后端统一响应格式：`{ success, message, data }`
- ✅ 自动解包 `data` 字段
- ✅ 添加错误处理和日志
- ✅ API 路径自动添加 `/api` 前缀

### 4. Articles API 更新 (`lib/api/articles.ts`)
**端点映射：**
- 列表：`/api/articles/`
- 详情：`/api/articles/{id}/`
- 分类：`/api/categories/`

**参数调整：**
- `pageSize` → `page_size`
- `category/tag` 使用数字 ID 而非 slug
- 新增 `getArticleById()` 函数

### 5. Resources API 更新 (`lib/api/resources.ts`)
**端点映射：**
- 列表：`/api/resource-website/websites/`
- 详情：`/api/resource-website/websites/{id}/`
- 分类：`/api/resource-website/categories/`

**新增功能：**
- 错误降级处理（返回空数据而非抛出异常）
- `getResourceById()` 函数

### 6. Search API 更新 (`lib/api/search.ts`)
**端点：**`/api/search/`

**响应处理：**
- 后端返回统一的搜索结果列表
- 前端通过字段判断区分资源和资源
- 标签列表从 `/api/tags/` 获取

### 7. 页面组件更新

#### 首页 (`app/(site)/page.tsx`)
- ✅ 参数名称更新：`pageSize` → `page_size`
- ✅ 排序字段：`-published_at` → `-created_time`

#### 资源卡片 (`components/content/article-card.tsx`)
- ✅ 使用 `article.name` 作为标题
- ✅ 使用 `article.id` 而非 `slug` 构建链接
- ✅ 从 HTML `content` 提取纯文本摘要
- ✅ 显示 `cover_img` 图片
- ✅ 使用单个 `category` 对象
- ✅ 移除 `readingTimeMinutes` 相关逻辑

#### 资源卡片 (`components/content/resource-card.tsx`)
- ✅ 使用 `resource.id` 构建链接
- ✅ `is_recommended` 替代 `isRecommended`
- ✅ 显示 `click_count`
- ✅ 使用单个 `category` 对象

#### 资源详情页 (`app/(site)/articles/[slug]/page.tsx`)
- ✅ URL 参数 `slug` 实际为 `id`（数字）
- ✅ 调用 `getArticleById(id)` 获取数据
- ✅ 从 HTML 内容提取摘要
- ✅ 直接渲染 HTML 内容（已包含格式）
- ✅ 显示单个分类

## 📊 后端 API 结构总结

### 资源模块
```
GET /api/articles/          # 资源列表
GET /api/articles/{id}/     # 资源详情
GET /api/categories/        # 资源分类列表
```

### 资源模块
```
GET /api/resource-website/websites/          # 资源列表
GET /api/resource-website/websites/{id}/     # 资源详情
GET /api/resource-website/categories/        # 资源分类列表
```

### 标签与搜索
```
GET /api/tags/          # 标签列表
GET /api/search/?q=     # 全局搜索
```

### 统一响应格式
```json
{
  "success": true,
  "message": "success",
  "data": {
    "results": [...],
    "count": 27,
    "next": "...",
    "previous": null,
    "page": 1,
    "page_size": 20,
    "total_pages": 2
  }
}
```

## 🚀 启动说明

1. **确保后端运行**
   ```bash
   # 后端应运行在 http://localhost:8000
   ```

2. **启动前端开发服务器**
   ```bash
   pnpm dev
   ```

3. **访问**
   ```
   http://localhost:3000
   ```

## ⚠️ 已知限制

1. **slug 支持缺失**
   - 后端不支持通过 slug 查询
   - URL 使用数字 ID：`/articles/44` 而非 `/articles/content-curation-framework`
   - 建议后端添加 slug 字段并支持查询

2. **资源 API 错误**
   - `/api/resource-website/websites/` 返回 500 错误
   - 已添加降级处理返回空列表
   - 需要后端修复此问题

3. **搜索结果类型区分**
   - 后端未返回明确的 `type` 字段
   - 前端通过启发式方法判断（存在 `url` 字段 = 资源）

4. **SEO 字段缺失**
   - 后端未提供 `seoTitle`, `seoDescription` 等字段
   - 前端从内容中提取

## 🔄 后续优化建议

### 后端优化
1. **添加 slug 字段**
   - 资源和资源都应该有 URL 友好的 slug
   - 支持通过 slug 查询

2. **修复资源 API**
   - 解决 `/api/resource-website/websites/` 500 错误

3. **搜索结果增强**
   - 返回明确的 `type: "article" | "resource"` 字段
   - 分离资源和资源到不同字段

4. **SEO 支持**
   - 添加 `meta_title`, `meta_description` 字段

### 前端优化
1. **错误处理**
   - 添加全局错误边界
   - 更友好的错误提示

2. **加载状态**
   - 添加 Skeleton 加载占位符

3. **图片优化**
   - 使用 Next.js Image 组件优化
   - 添加 placeholder 和 blur 效果

## 📝 测试清单

- [x] 首页数据加载
- [x] 资源列表显示
- [x] 资源详情页（通过 ID）
- [ ] 资源列表显示（后端 API 错误）
- [x] 分类数据加载
- [x] 标签数据加载
- [x] 搜索功能（前端降级）
- [x] 主题切换
- [x] 响应式布局

## 🎉 完成状态

前后端联调基础功能已完成！现在可以：
- ✅ 从后端 API 获取资源数据
- ✅ 显示资源列表和详情
- ✅ 显示分类和标签
- ✅ 基本搜索功能（待后端完善）
- ⚠️ 资源功能需等待后端修复

下一步请访问 http://localhost:3000 查看效果。
