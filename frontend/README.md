# Lenjoy 资源分享站 · 前端项目

基于 Next.js 15 (App Router) 构建的前台站点，负责展示站长策展的资源与资源导航数据。后端计划采用 Django REST Framework 提供 RESTful API，本项目在 API 未接入时会回退到静态示例数据。

## 技术栈

- Next.js 15 + React 19 App Router
- TypeScript · ESLint · Prettier
- Tailwind CSS 4 + shadcn/ui 组件库
- @tanstack/react-query 处理客户端数据缓存
- next-themes 实现暗/亮主题切换

## 环境变量

| 变量名                     | 说明                                                                                | 默认 |
| -------------------------- | ----------------------------------------------------------------------------------- | ---- |
| `NEXT_PUBLIC_API_BASE_URL` | Django REST API 根地址，例如 `https://api.example.com/`。若为空则使用内置示例数据。 | 空   |

## 本地开发

```bash
pnpm install
pnpm dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

## 项目结构

- `app/(site)`：前台页面路由（首页、资源、资源、搜索等）
- `components/`：UI 组件、布局与 Providers
- `lib/api/`：封装对 Django REST API 的请求，包含示例数据兜底
- `lib/data/`：静态示例数据，便于无后端时预览
- `docs/需求文档.md`：产品需求与范围说明

## 常用脚本

```bash
pnpm dev       # 本地开发（Turbopack）
pnpm build     # 生产构建
pnpm start     # 生产模式启动
pnpm lint      # ESLint + TypeScript 检查
```

## 后续计划

- 接入 Django REST Framework 实际接口并完善数据模型
- 补充资源与资源的更多筛选、排序能力
- 支持用户交互功能（收藏、订阅、投稿等）


1. 资源需要分页
2. 资源详情需要正文，作者，发布日期，阅读量，相关资源推荐，热门资源推荐
3. 资源的标签和分类不需要单独的聚合页面，在资源列表页支持筛选就好
4. 资源暂时不需要评论功能
5. 资源网站目前不需要详情信息，在资源网站卡片点击直接跳转就行
6. 每个分类下的资源网站个位数到30个之内
7. 需要推荐，热门标记。推荐是管理员设置的，推荐是根据点击量计算
8. 需要统计每个资源的点击量/访问量
9. 搜索目前只需要支持资源搜索就行
10. 搜索不需要支持分类，标签筛选
11. 需要搜索历史记录和热门搜索词
12. 最新资源暂时3篇
13. 热门资源排序依据是浏览量
14. 热门资源网站的排序依据是点击量
15. 不需要用户登录注册功能
16. 不支持用户收藏功能
17. 不需要用户反馈功能
18. 不需要管理后台，django自带的目前够了
19. 需要移动端适配的
20. 需要网站地图
21. 需要seo优化