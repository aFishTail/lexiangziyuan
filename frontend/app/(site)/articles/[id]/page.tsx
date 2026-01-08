import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Eye, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArticleCard } from "@/components/content/article-card";
import { SectionHeader } from "@/components/content/section-header";
import { ArticleViewTracker } from "@/components/content/article-view-tracker";
import {
  getArticle,
  getRelatedArticles,
  getPopularArticles,
} from "@/lib/api/articles";
import type { Article, ArticleSummary } from "@/lib/types/content";
import { formatDate } from "@/lib/utils/format";

interface ArticleDetailPageProps {
  params: Promise<{ id: string }>;
}

// 强制动态渲染
export const dynamic = "force-dynamic";
export const revalidate = 0;

// 生成动态 Meta 标签
export async function generateMetadata({ params }: ArticleDetailPageProps) {
  const { id } = await params;
  try {
    const article = await getArticle(Number(id));

    return {
      title: `${article.name} | Lenjoy`,
      description: article.content.substring(0, 150).replace(/<[^>]*>/g, ""),
      keywords: article.tags.map((t) => t.name).join(", "),
      openGraph: {
        title: article.name,
        description: article.content.substring(0, 150).replace(/<[^>]*>/g, ""),
        images: article.cover_img ? [article.cover_img] : [],
        type: "article",
        publishedTime: article.created_time,
      },
      twitter: {
        card: "summary_large_image",
        title: article.name,
        description: article.content.substring(0, 150).replace(/<[^>]*>/g, ""),
        images: article.cover_img ? [article.cover_img] : [],
      },
    };
  } catch {
    return {
      title: "资源未找到 | Lenjoy",
    };
  }
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { id } = await params;
  try {
    const articleId = Number(id);

    // 获取资源详情
    const article = await getArticle(articleId);

    // 并行获取相关和热门资源
    const [relatedArticles, popularArticles] = await Promise.all([
      getRelatedArticles(articleId, 6).catch(() => []),
      getPopularArticles(6).catch(() => []),
    ]);

    // 过滤掉当前资源
    const filteredRelated = relatedArticles.filter((a) => a.id !== articleId);
    const filteredPopular = popularArticles.filter((a) => a.id !== articleId);

    return (
      <ArticleDetailView
        article={article}
        relatedArticles={filteredRelated}
        popularArticles={filteredPopular}
      />
    );
  } catch {
    notFound();
  }
}

interface ArticleDetailViewProps {
  article: Article;
  relatedArticles: ArticleSummary[];
  popularArticles: ArticleSummary[];
}

function ArticleDetailView({
  article,
  relatedArticles,
  popularArticles,
}: ArticleDetailViewProps) {
  return (
    <>
      {/* 面包屑导航 */}
      <nav className="border-b bg-muted/30">
        <div className="container max-w-6xl py-4">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="transition hover:text-foreground">
                首页
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link
                href="/articles"
                className="transition hover:text-foreground"
              >
                资源
              </Link>
            </li>
            {article.category && (
              <>
                <ChevronRight className="h-4 w-4" />
                <li>
                  <Link
                    href={`/articles?category=${article.category.id}`}
                    className="transition hover:text-foreground"
                  >
                    {article.category.name}
                  </Link>
                </li>
              </>
            )}
            <ChevronRight className="h-4 w-4" />
            <li className="truncate font-medium text-foreground">
              {article.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* 资源头部 */}
      <header className="border-b bg-linear-to-b from-muted/30 to-background">
        <div className="container max-w-4xl py-12">
          {/* 分类徽章 */}
          {article.category && (
            <div className="mb-6">
              <Badge className="text-sm">{article.category.name}</Badge>
            </div>
          )}

          {/* 标题 */}
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            {article.name}
          </h1>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            {/* 发布日期 */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={article.created_time}>
                {formatDate(article.created_time)}
              </time>
            </div>

            {/* 阅读量 */}
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{article.view_count.toLocaleString()} 次阅读</span>
            </div>
          </div>

          {/* 标签 Pills */}
          {article.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/articles?tags=${tag.id}`}
                  className="transition hover:scale-105"
                >
                  <Badge variant="secondary" className="cursor-pointer">
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 资源正文 */}
      <article className="container max-w-4xl py-12">
        {/* 富文本内容渲染 */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <Separator className="my-12" />

        {/* 资源底部信息 */}
        <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-6">
          <div className="space-y-1">
            <p className="text-sm font-medium">发布于</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(article.created_time)}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-sm font-medium">最后更新</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(article.update_time)}
            </p>
          </div>
        </div>
      </article>

      {/* 相关资源推荐 */}
      {relatedArticles.length > 0 && (
        <section className="border-t bg-muted/20 py-16">
          <div className="container max-w-6xl space-y-8">
            <SectionHeader
              title="相关资源推荐"
              description="基于分类和标签的相关内容"
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.slice(0, 3).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 热门资源推荐 */}
      {popularArticles.length > 0 && (
        <section className="border-t py-16">
          <div className="container max-w-6xl space-y-8">
            <SectionHeader
              title="热门资源推荐"
              description="根据阅读量推荐的热门内容"
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {popularArticles.slice(0, 3).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 浏览量追踪 */}
      <ArticleViewTracker id={article.id} />
    </>
  );
}
