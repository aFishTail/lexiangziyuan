import Link from "next/link";

import { ResourceWebsiteCard } from "@/components/content/resource-website-card";
import {
  getResourcesWebsite,
  getResourceCategories,
} from "@/lib/api/resource-websites";
import { cn } from "@/lib/utils";

interface WebsitesPageProps {
  searchParams: {
    category?: string;
  };
}

export const revalidate = 300;

export default async function WebsitesPage({
  searchParams,
}: WebsitesPageProps) {
  const currentCategory = searchParams.category
    ? Number(searchParams.category)
    : undefined;

  // 并行获取资源和分类数据
  const [resourceWebsites, categories] = await Promise.all([
    getResourcesWebsite({ category: currentCategory }),
    getResourceCategories(),
  ]);

  return (
    <div className="container space-y-8 py-12">
      {/* 页面头部 */}
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
            资源网站导航
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            精选各领域优质网站，快速发现实用工具、学习资源与创意平台。
          </p>
        </div>

        {/* 分类Tab导航 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Link
            href="/websites"
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
              !currentCategory
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            <span>全部</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                !currentCategory
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {resourceWebsites.length}
            </span>
          </Link>

          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/websites?category=${category.id}`}
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all",
                currentCategory === category.id
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              <span>{category.name}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs",
                  currentCategory === category.id
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {category.resource_count || 0}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 资源网格 */}
      <section>
        {resourceWebsites.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {resourceWebsites.map((item) => (
              <ResourceWebsiteCard key={item.id} resourceWebsite={item} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20 p-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              暂无资源
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">
              该分类下还没有收录资源，敬请期待后续更新。
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
