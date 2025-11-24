import Link from "next/link";
import { ArrowUpDown } from "lucide-react";

import { ArticleCard } from "@/components/content/article-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getArticles, getArticleCategories } from "@/lib/api/articles";
import { cn } from "@/lib/utils";

interface ArticlesPageProps {
  searchParams: {
    page?: string;
    category?: string;
    ordering?: string;
  };
}

export const revalidate = 60;

export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const page = Number(searchParams.page ?? "1") || 1;
  const category = searchParams.category
    ? Number(searchParams.category)
    : undefined;
  const ordering = searchParams.ordering || "-created_time";

  // 获取数据
  const [articlesData, categories] = await Promise.all([
    getArticles({
      page,
      page_size: 12,
      category,
      ordering,
    }),
    getArticleCategories(),
  ]);

  const articles = articlesData.results; // ✅ 使用 results 而不是 data
  const pagination = {
    page: articlesData.page,
    page_size: articlesData.page_size,
    total: articlesData.count,
    total_pages: articlesData.total_pages,
  };

  // 构建URL参数
  const buildUrl = (params: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.set(key, String(value));
      }
    });
    return `/articles?${query.toString()}`;
  };

  return (
    <div className="container space-y-8 py-12">
      {/* 页面标题 */}
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
            资源精选
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            精选的高质量资源，支持快速搜索和浏览。
          </p>
        </div>

        {/* 分类 Tab 导航 */}
        <div className="flex items-center gap-3 overflow-x-auto border-b border-border pb-px">
          <Link
            href="/articles"
            className={cn(
              "inline-flex items-center gap-2 border-b-2 px-4 py-3 text-base font-medium transition-colors",
              !category
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <span>全部</span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                !category
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {pagination.total}
            </span>
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/articles?category=${cat.id}`}
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-base font-medium transition-colors",
                category === cat.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <span>{cat.name}</span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  category === cat.id
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {cat.article_count || 0}
              </span>
            </Link>
          ))}
        </div>

        {/* 排序选项 */}
        <div className="flex items-center gap-3 text-sm">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">排序：</span>
          <Link
            href={buildUrl({
              page: 1,
              category,
              ordering: "-created_time",
            })}
            className={
              ordering === "-created_time"
                ? "font-semibold text-foreground"
                : "text-muted-foreground transition hover:text-foreground"
            }
          >
            最新发布
          </Link>
          <span className="text-muted-foreground" aria-hidden>
            ·
          </span>
          <Link
            href={buildUrl({
              page: 1,
              category,
              ordering: "-view_count",
            })}
            className={
              ordering === "-view_count"
                ? "font-semibold text-foreground"
                : "text-muted-foreground transition hover:text-foreground"
            }
          >
            热门优先
          </Link>
        </div>
      </section>

      {/* 资源列表 */}
      <section className="space-y-6">
        {/* 结果统计 */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            共{" "}
            <strong className="font-semibold text-foreground">
              {pagination.total}
            </strong>{" "}
            篇资源
          </span>
          <span>
            第 {pagination.page} / {pagination.total_pages} 页
          </span>
        </div>

        {/* 资源网格 */}
        {articles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              没有找到符合条件的资源
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              试试调整筛选条件或{" "}
              <Link href="/articles" className="text-primary hover:underline">
                查看全部资源
              </Link>
            </p>
          </div>
        )}

        {/* 分页导航 */}
        {pagination.total_pages > 1 && (
          <div className="flex justify-center pt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={
                      page > 1
                        ? buildUrl({
                            page: page - 1,
                            category,
                            ordering,
                          })
                        : undefined
                    }
                    aria-disabled={page <= 1}
                    className={
                      page <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {/* 页码显示逻辑：显示前3页、当前页前后各1页、最后3页 */}
                {Array.from({ length: pagination.total_pages }).map(
                  (_, index) => {
                    const pageNumber = index + 1;
                    const showPage =
                      pageNumber <= 3 ||
                      pageNumber >= pagination.total_pages - 2 ||
                      Math.abs(pageNumber - page) <= 1;

                    if (!showPage) {
                      // 显示省略号
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
                          href={buildUrl({
                            page: pageNumber,
                            category,
                            ordering,
                          })}
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
                        ? buildUrl({
                            page: page + 1,
                            category,
                            ordering,
                          })
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
    </div>
  );
}
