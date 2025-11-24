import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";

import { SearchForm } from "@/components/search/search-form";
import { ArticleCard } from "@/components/content/article-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { searchArticles, getTrendingKeywords } from "@/lib/api/search";

interface SearchPageProps {
  searchParams: {
    q?: string;
    page?: string;
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const page = Number(searchParams.page ?? "1") || 1;

  // 如果有搜索关键词，则执行搜索
  const searchResults = query
    ? await searchArticles({ q: query, page, page_size: 12 })
    : null;

  // 获取热门搜索词
  const trendingKeywords = await getTrendingKeywords(10);

  const articles = searchResults?.results || [];
  const pagination = searchResults
    ? {
        page: searchResults.page,
        page_size: searchResults.page_size,
        total: searchResults.count,
        total_pages: searchResults.total_pages,
      }
    : null;

  return (
    <div className="container space-y-8 py-12">
      {/* 页面标题和搜索框 */}
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <SearchIcon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
            搜索资源
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {query
              ? `搜索 "${query}" 的结果`
              : "输入关键词，在站内搜索资源内容"}
          </p>
        </div>

        {/* 搜索表单 */}
        <SearchForm initialQuery={query} />
      </section>

      {/* 搜索结果或建议区 */}
      {query ? (
        // 有搜索关键词：显示结果
        <section className="space-y-6">
          {/* 结果统计 */}
          {pagination && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                找到{" "}
                <strong className="font-semibold text-foreground">
                  {pagination.total}
                </strong>{" "}
                篇相关资源
              </span>
              {pagination.total_pages > 1 && (
                <span>
                  第 {pagination.page} / {pagination.total_pages} 页
                </span>
              )}
            </div>
          )}

          {/* 搜索结果 */}
          {articles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            // 无结果状态
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 p-12 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <SearchIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                没有找到相关资源
              </h3>
              <p className="mb-6 max-w-md text-sm text-muted-foreground">
                试试其他关键词，或者浏览下方的热门搜索词
              </p>

              {/* 热门搜索词 */}
              {trendingKeywords.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    热门搜索：
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {trendingKeywords.map((item) => (
                      <Link
                        key={item.keyword}
                        href={`/search?q=${encodeURIComponent(item.keyword)}`}
                        className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:bg-primary/5"
                      >
                        {item.keyword}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 分页导航 */}
          {pagination && pagination.total_pages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={
                        page > 1
                          ? `/search?q=${encodeURIComponent(query)}&page=${
                              page - 1
                            }`
                          : undefined
                      }
                      aria-disabled={page <= 1}
                      className={
                        page <= 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {/* 页码显示逻辑 */}
                  {Array.from({ length: pagination.total_pages }).map(
                    (_, index) => {
                      const pageNumber = index + 1;
                      const showPage =
                        pageNumber <= 3 ||
                        pageNumber >= pagination.total_pages - 2 ||
                        Math.abs(pageNumber - page) <= 1;

                      if (!showPage) {
                        if (
                          pageNumber === 4 ||
                          pageNumber === pagination.total_pages - 3
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <span className="px-4">...</span>
                            </PaginationItem>
                          );
                        }
                        return null;
                      }

                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href={`/search?q=${encodeURIComponent(
                              query
                            )}&page=${pageNumber}`}
                            isActive={pageNumber === page}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href={
                        page < pagination.total_pages
                          ? `/search?q=${encodeURIComponent(query)}&page=${
                              page + 1
                            }`
                          : undefined
                      }
                      aria-disabled={page >= pagination.total_pages}
                      className={
                        page >= pagination.total_pages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </section>
      ) : (
        // 无搜索关键词：显示搜索建议
        <section className="mx-auto max-w-3xl space-y-8">
          {/* 热门搜索词 */}
          {trendingKeywords.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <h2 className="text-lg font-semibold text-foreground">
                  热门搜索
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingKeywords.map((item, index) => (
                  <Link
                    key={item.keyword}
                    href={`/search?q=${encodeURIComponent(item.keyword)}`}
                    className="group relative inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <span className="text-foreground">{item.keyword}</span>
                    {item.search_count && (
                      <span className="text-xs text-muted-foreground">
                        {item.search_count}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 搜索提示 */}
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <svg
                className="h-6 w-6 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-base font-medium text-foreground">
              搜索技巧
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 输入资源标题关键词进行搜索</li>
              <li>• 可以尝试上方的热门搜索词</li>
              <li>• 搜索历史会自动保存，方便下次使用</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/articles"
              className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              浏览所有资源
            </Link>
            <Link
              href="/websites"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              探索资源导航
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
