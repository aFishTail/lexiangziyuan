import Link from "next/link";

import { ArticleCard } from "@/components/content/article-card";
import { CategoryPills } from "@/components/content/category-pills";
import { ResourceWebsiteCard } from "@/components/content/resource-website-card";
import { SectionHeader } from "@/components/content/section-header";
import { Button } from "@/components/ui/button";
import {
  getArticles,
  getLatestArticles,
  getPopularArticles,
  getArticleCategories,
} from "@/lib/api/articles";
import {
  getResourcesWebsite,
  getResourceCategories,
} from "@/lib/api/resource-websites";
import { getSiteStats } from "@/lib/api/stats";

export const revalidate = 600;

export default async function HomePage() {
  const [
    latestArticlesData,
    popularArticlesData,
    resourcesWebsiteData,
    articleCategories,
    resourceCategories,
    siteStats,
  ] = await Promise.all([
    getLatestArticles(3),
    getPopularArticles(3),
    getResourcesWebsite({}),
    getArticleCategories(),
    getResourceCategories(),
    getSiteStats(),
  ]);

  const latestArticles = latestArticlesData;
  const popularArticles = popularArticlesData;
  const resourceWebsites = resourcesWebsiteData.slice(0, 6); // 只取前6个

  return (
    <div className="space-y-20 pb-20">
      {/* Hero 区域 - 全新设计 */}
      <section className="relative overflow-hidden border-b border-border/40 bg-linear-to-br from-background via-muted/20 to-background">
        {/* 装饰性背景 */}
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container relative py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            {/* 左侧内容 */}
            <div className="flex flex-col justify-center space-y-8">
              {/* 标签 */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  精选聚合·悦享成长
                </span>
              </div>

              {/* 主标题 */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  汇聚精选资源，
                  <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    精品网站导航
                  </span>
                </h1>
                <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  收集整理全网优质资源和精选网站，让优质资源触手可及
                </p>
              </div>

              {/* CTA 按钮 */}
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-8 text-base shadow-lg shadow-primary/20"
                >
                  <Link href="/articles" className="gap-2">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    查看精选资源
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base"
                >
                  <Link href="/websites" className="gap-2">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    探索资源网站
                  </Link>
                </Button>
              </div>

              {/* 统计数据 */}
              <div className="grid grid-cols-4 gap-6 pt-4">
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-foreground">
                    {siteStats.article_count}+
                  </div>
                  <div className="text-sm text-muted-foreground">精选资源</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-foreground">
                    {siteStats.resource_count}+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    优质资源网站
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-foreground">
                    {siteStats.category_count +
                      siteStats.resource_category_count}
                    +
                  </div>
                  <div className="text-sm text-muted-foreground">内容分类</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-foreground">
                    {siteStats.tag_count}+
                  </div>
                  <div className="text-sm text-muted-foreground">内容标签</div>
                </div>
              </div>
            </div>

            {/* 右侧卡片 */}
            <div className="flex items-center">
              <div className="w-full space-y-4 rounded-2xl border border-border/60 bg-card/80 p-8 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    快速导航
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      资源分类
                    </div>
                    <CategoryPills
                      categories={articleCategories.slice(0, 6)}
                      basePath="/articles"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                      网站分类
                    </div>
                    <CategoryPills
                      categories={resourceCategories.slice(0, 6)}
                      basePath="/websites"
                    />
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
                  <p className="text-sm text-muted-foreground">
                    没找到想要的？
                    <Link
                      href="/search"
                      className="ml-1 font-medium text-primary hover:underline"
                    >
                      试试搜索功能
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 最新资源 */}
      <section className="container space-y-10">
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Latest
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            最新资源
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            最新收录的高质量资源内容，涵盖行业洞察与实践经验
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
        <div className="flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/articles" className="gap-2">
              查看全部资源
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </Button>
        </div>
      </section>

      {/* 热门资源 */}
      <section className="container space-y-10">
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Popular
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            热门资源
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            最受欢迎的精选资源，经过验证的优质内容
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {popularArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
        <div className="flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/articles" className="gap-2">
              查看更多资源
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </Button>
        </div>
      </section>

      {/* 热门资源网站 */}
      <section className="relative overflow-hidden bg-muted/30 py-20">
        <div className="container space-y-10">
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Popular
            </div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              热门资源网站
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              精选实用工具与优质平台，助力学习与工作效率提升
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {resourceWebsites.map((website) => (
              <ResourceWebsiteCard key={website.id} resourceWebsite={website} />
            ))}
          </div>
          <div className="flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/websites" className="gap-2">
                浏览全部网站
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="container">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-linear-to-br from-primary/10 via-primary/5 to-primary/10 p-12 text-center shadow-xl sm:p-16">
          {/* 装饰元素 */}
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                发现更多资源
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                使用站内搜索功能，快速找到你需要的资源
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 shadow-lg shadow-primary/20"
              >
                <Link href="/search" className="gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  开始搜索
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
