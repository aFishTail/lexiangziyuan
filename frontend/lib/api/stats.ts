import { apiFetch } from "./client";

// ============= 统计数据接口 =============

export interface SiteStats {
    article_count: number;           // 资源总数
    resource_count: number;          // 资源总数
    category_count: number;          // 资源分类总数
    resource_category_count: number; // 资源分类总数
    tag_count: number;               // 标签总数
}

// 获取网站统计数据
export async function getSiteStats(): Promise<SiteStats> {
    return apiFetch<SiteStats>("/setting/stats/", {
        next: { revalidate: 300 }, // 缓存5分钟
    });
}
