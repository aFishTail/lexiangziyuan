import { apiFetch } from "./client";
import type { ResourceWebsite, ResourceWebsiteCategory } from "@/lib/types/content";

// ============= 资源网站相关接口 =============

// 获取资源列表参数
export interface GetResourcesParams {
    category?: number;       // 分类 ID（改为 number）
    ordering?: string;       // 排序，默认 -is_featured,-visit_count,-created_time
}

// 获取资源列表（❌ 不需要分页）
export async function getResourcesWebsite(
    params: GetResourcesParams = {}
): Promise<ResourceWebsite[]> {
    const response = await apiFetch<ResourceWebsite[]>("/resource-websites/websites", {
        searchParams: {
            // category: params.category,
            ordering: params.ordering || "-is_featured,-visit_count,-created_time",
        },
        next: { revalidate: 120 }, // 缓存2分钟
    });
    console.log("response:", response)
    return response;
}

// 增加资源点击量
export async function incrementResourceClick(id: number): Promise<{ visit_count: number }> {
    return apiFetch<{ visit_count: number }>(`/websites/${id}/increment-visit/`, {
        method: "POST",
    });
}

// 获取热门资源
export async function getPopularResources(limit: number = 6): Promise<ResourceWebsite[]> {
    const response = await apiFetch<ResourceWebsite[]>("/websites/popular/", {
        searchParams: { limit },
        next: { revalidate: 300 },
    });
    return response;
}

// ============= 分类相关接口 =============

// 获取资源分类列表
export async function getResourceCategories(): Promise<ResourceWebsiteCategory[]> {
    const response = await apiFetch<ResourceWebsiteCategory[]>("/resource-websites/categories/", {
        next: { revalidate: 300 },
    });
    return response;
}
