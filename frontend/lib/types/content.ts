// ============= 基础类型 =============

// 资源分类（独立模型）
export interface ArticleCategory {
    id: number;
    name: string;
    description?: string;
    order: number;
    article_count?: number;     // API 返回时计算
}

// 资源分类（独立模型）
export interface ResourceWebsiteCategory {
    id: number;
    name: string;
    description?: string;
    order: number;
    icon?: string;
    resource_count?: number;    // API 返回时计算
}

// 标签（仅用于资源）
export interface Tag {
    id: number;
    name: string;
    synonyms: string[];
    article_count?: number;     // API 返回时计算
}

// ============= 资源相关 =============

// 资源摘要（列表页使用）
export interface ArticleSummary {
    id: number;
    name: string;               // ✅ 标题字段名改为 name
    cover_img?: string;         // ✅ 封面图字段名改为 cover_img
    view_count: number;         // ✅ 必需
    category: ArticleCategory;
    tags: Tag[];
    created_time: string;       // ✅ 作为发布时间使用
    status: number;             // 状态 (0=待审核, 1=已发布, 3=已下架)
}

// 资源详情（详情页使用）
export interface Article extends ArticleSummary {
    content: string;            // ✅ 必需 - 富文本格式正文
    source: string;             // 来源
    remark: string;             // 备注
    update_time: string;        // 更新时间
}

// ============= 资源网站相关 =============

// 资源网站
export interface ResourceWebsite {
    id: number;
    name: string;
    description: string;
    url: string;                // ✅ 必需 - 外部网站链接
    logo?: string;
    category: ResourceWebsiteCategory;
    visit_count: number;        // ✅ 访问次数（对应需求的 click_count）
    is_featured: boolean;       // ✅ 是否推荐（对应需求的 is_recommended）
    status: number;             // 状态 (0=待审核, 1=已发布, 2=已禁用)
    remark: string;             // 备注
    created_time: string;
    update_time: string;
    // ❌ 没有 tags 字段，资源网站没有标签
    // ❌ 不需要 is_hot 字段，通过接口根据 visit_count 动态返回热门资源
}

// ============= API 响应格式 =============

// 统一响应格式
export interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: string;
}

// 分页响应（匹配后端实际返回格式）
export interface PaginatedResponse<T> {
    results: T[];           // ✅ 后端使用 results 而不是 data
    count: number;          // 总记录数
    next: string | null;    // 下一页URL
    previous: string | null; // 上一页URL
    page: number;           // 当前页码
    page_size: number;      // 每页数量
    total_pages: number;    // 总页数
}

// ============= 搜索相关 =============

// 搜索历史（localStorage）
export interface SearchHistoryItem {
    keyword: string;
    timestamp: number;
}

// 热门搜索词
export interface TrendingKeyword {
    id: number;
    keyword: string;
    search_count?: number;
}
