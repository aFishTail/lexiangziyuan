import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ArticleSummary } from "@/lib/types/content";
import { formatDate } from "@/lib/utils/format";

interface ArticleCardProps {
  article: ArticleSummary;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const publishedDate = formatDate(article.created_time);

  return (
    <Link href={`/articles/${article.id}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1">
        {/* 封面图片区域 */}
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          {article.cover_img ? (
            <Image
              src={article.cover_img}
              alt={article.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-linear-to-br from-muted to-muted/50">
              <svg
                className="h-16 w-16 text-muted-foreground/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* 分类标签 - 浮在图片上 */}
          {article.category && (
            <div className="absolute left-3 top-3">
              <Badge className="bg-background/90 text-foreground shadow-lg backdrop-blur-sm">
                {article.category.name}
              </Badge>
            </div>
          )}
        </div>

        {/* 内容区域 */}
        <div className="flex flex-1 flex-col p-5">
          {/* 标题 */}
          <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
            {article.name}
          </h3>

          {/* 摘要 - 前端从 content 截取，暂时不显示 */}
          {/* <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {article.summary}
                    </p> */}

          {/* 标签 */}
          {article.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {article.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="rounded-md px-2 py-0.5 text-xs font-normal"
                >
                  #{tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* 底部元信息 */}
          <div className="mt-auto space-y-3 border-t border-border/50 pt-4">
            {/* 发布日期 */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={article.created_time}>{publishedDate}</time>
              </div>
            </div>

            {/* 阅读量 */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              <span>{article.view_count} 次阅读</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
