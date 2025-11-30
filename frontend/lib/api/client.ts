import type { ApiResponse } from "@/lib/types/content";

export interface ApiFetchOptions extends RequestInit {
    searchParams?: Record<string, string | number | boolean | undefined>;
    next?: {
        revalidate?: number;
        tags?: string[];
    };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

function buildUrl(path: string, searchParams?: ApiFetchOptions["searchParams"]) {
    // 确保路径以 /api 开头
    const apiPath = path.startsWith("/api") ? path : `/api${path}`;
    const url = new URL(apiPath.replace(/^\//, ""), API_BASE_URL);

    if (searchParams) {
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") {
                return;
            }
            url.searchParams.append(key, String(value));
        });
    }

    return url.toString();
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
    const { searchParams, headers, next, ...rest } = options;
    const url = buildUrl(path, searchParams);

    try {
        const response = await fetch(url, {
            ...rest,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            next,
        });

        if (!response.ok) {
            throw new Error(`Request to ${url} failed with status ${response.status}`);
        }

        // 解析统一响应格式
        const result = (await response.json()) as ApiResponse<T>;

        // 返回 data 部分
        return result.data as T;
    } catch (error) {
        console.error(`API fetch error for ${url}:`, error);
        throw error;
    }
}

export function hasApiBaseUrl() {
    return Boolean(API_BASE_URL);
}
