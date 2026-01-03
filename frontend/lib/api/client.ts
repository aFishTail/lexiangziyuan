import type { ApiResponse } from "@/lib/types/content";

export interface ApiFetchOptions extends RequestInit {
  searchParams?: Record<string, string | number | boolean | undefined>;
  next?: {
    revalidate?: number;
    tags?: string[];
  };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost/api";

function buildUrl(
  path: string,
  searchParams?: ApiFetchOptions["searchParams"]
) {
  // 直接拼接 URL，确保 path 前不要有 /
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const baseUrl = API_BASE_URL.endsWith("/")
    ? API_BASE_URL
    : API_BASE_URL + "/";
  const fullUrl = baseUrl + cleanPath;

  const url = new URL(fullUrl);

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

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
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
      throw new Error(
        `Request to ${url} failed with status ${response.status}`
      );
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
