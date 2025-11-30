import { apiFetch } from "./client";
import type { ArticleSummary, PaginatedResponse, TrendingKeyword } from "@/lib/types/content";

// ============= 搜索相关接口（需求文档 6.6 节）=============

// 13. 搜索资源参数
export interface SearchArticlesParams {
    q: string;               // 搜索关键词（必填）
    page?: number;           // 页码，默认1
    page_size?: number;      // 每页数量，默认12
}

// 13. 搜索资源（✅ 只搜索资源，❌ 不搜索资源）
export async function searchArticles(
    params: SearchArticlesParams
): Promise<PaginatedResponse<ArticleSummary>> {
    return apiFetch<PaginatedResponse<ArticleSummary>>("/search/articles/", {
        searchParams: {
            q: params.q,
            page: params.page || 1,
            page_size: params.page_size || 12,
        },
        next: { revalidate: 30 },
    });
}

// 14. 获取热门搜索词
export async function getTrendingKeywords(limit: number = 10): Promise<TrendingKeyword[]> {
    const response = await apiFetch<TrendingKeyword[]>("/search/trending/", {
        searchParams: { limit },
        next: { revalidate: 300 },
    });
    return response;
}

// ============= 搜索历史（localStorage 前端实现）=============

const SEARCH_HISTORY_KEY = "lenjoy_search_history";
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
    keyword: string;
    timestamp: number;
}

// 获取搜索历史
export function getSearchHistory(): SearchHistoryItem[] {
    if (typeof window === "undefined") return [];

    try {
        const history = localStorage.getItem(SEARCH_HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    } catch {
        return [];
    }
}

// 添加搜索历史
export function addSearchHistory(keyword: string): void {
    if (typeof window === "undefined" || !keyword.trim()) return;

    try {
        const history = getSearchHistory();

        // 移除重复项
        const filtered = history.filter(item => item.keyword !== keyword);

        // 添加新项到开头
        filtered.unshift({
            keyword,
            timestamp: Date.now(),
        });

        // 只保留最近10条
        const updated = filtered.slice(0, MAX_HISTORY_ITEMS);

        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error("Failed to save search history:", error);
    }
}

// 删除单条搜索历史
export function removeSearchHistory(keyword: string): void {
    if (typeof window === "undefined") return;

    try {
        const history = getSearchHistory();
        const updated = history.filter(item => item.keyword !== keyword);
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error("Failed to remove search history:", error);
    }
}

// 清空搜索历史
export function clearSearchHistory(): void {
    if (typeof window === "undefined") return;

    try {
        localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
        console.error("Failed to clear search history:", error);
    }
}
