import { apiFetch } from "./client";
import type { Article, ArticleSummary, PaginatedResponse, ArticleCategory, Tag } from "@/lib/types/content";

// ============= 资源相关接口 =============

// 1. 获取资源列表参数
export interface GetArticlesParams {
    page?: number;           // 页码，默认1
    page_size?: number;      // 每页数量，默认12
    category?: number;       // 分类 ID（改为 number）
    tags?: string;           // 标签 ID，多个用逗号分隔
    ordering?: string;       // 排序，默认 -created_time
}

// 1. 获取资源列表
export async function getArticles(
    params: GetArticlesParams = {}
): Promise<PaginatedResponse<ArticleSummary>> {
    return apiFetch<PaginatedResponse<ArticleSummary>>("/articles/", {
        searchParams: {
            page: params.page || 1,
            page_size: params.page_size || 12,
            category_id: params.category,
            tags: params.tags,
            ordering: params.ordering || "-created_time",
        },
        next: { revalidate: 60 }, // 缓存60秒
    });
}

// 2. 获取资源详情
export async function getArticle(id: number): Promise<Article> {
    return apiFetch<Article>(`/articles/${id}/`, {
        next: { revalidate: 300 }, // 缓存5分钟
    });
}

// 3. 增加资源浏览量
export async function incrementArticleView(id: number): Promise<{ view_count: number }> {
    return apiFetch<{ view_count: number }>(`/articles/${id}/increment-view/`, {
        method: "POST",
    });
}

// 4. 获取相关资源推荐
export async function getRelatedArticles(
    id: number,
    limit: number = 6
): Promise<ArticleSummary[]> {
    const response = await apiFetch<ArticleSummary[]>(
        `/articles/${id}/related/`,
        {
            searchParams: { limit },
            next: { revalidate: 300 },
        }
    );
    return response;
}

// 5. 获取热门资源
export async function getPopularArticles(limit: number = 6): Promise<ArticleSummary[]> {
    const response = await apiFetch<ArticleSummary[]>("/articles/hot/", {
        searchParams: { limit },
        next: { revalidate: 300 },
    });
    return response;
}

// 6. 获取最新资源
export async function getLatestArticles(limit: number = 3): Promise<ArticleSummary[]> {
    const response = await apiFetch<PaginatedResponse<ArticleSummary>>("/articles", {
        searchParams: { order: '-create_time', page_size: limit },
        next: { revalidate: 60 },
    });
    return response.results;
}

// ============= 分类相关接口 =============

// 获取资源分类列表
export async function getArticleCategories(): Promise<ArticleCategory[]> {
    const response = await apiFetch<ArticleCategory[]>("/categories", {
        next: { revalidate: 300 },
    });
    return response;
}

// ============= 标签相关接口 =============

// 获取标签列表
export async function getTags(category?: number): Promise<Tag[]> {
    const response = await apiFetch<Tag[]>("/tags/", {
        searchParams: { category },
        next: { revalidate: 300 },
    });
    return response;
}
