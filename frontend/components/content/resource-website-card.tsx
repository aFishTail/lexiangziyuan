"use client";

import Image from "next/image";
import { incrementResourceClick } from "@/lib/api/resource-websites";
import type { ResourceWebsite } from "@/lib/types/content";

interface ResourceWebsiteCardProps {
  resourceWebsite: ResourceWebsite;
}

export function ResourceWebsiteCard({
  resourceWebsite,
}: ResourceWebsiteCardProps) {
  const handleClick = async () => {
    try {
      // 在新标签页打开链接
      window.open(resourceWebsite.url, "_blank", "noopener,noreferrer");

      // 异步增加访问量
      await incrementResourceClick(resourceWebsite.id);
    } catch (error) {
      console.error("Failed to increment resource visit count:", error);
    }
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1">
      {/* Logo/Icon 区域 */}
      <div className="relative h-32 w-full overflow-hidden bg-linear-to-br from-muted/50 to-muted">
        {resourceWebsite.logo ? (
          <div className="flex h-full items-center justify-center p-6">
            <div className="relative h-16 w-16">
              <Image
                src={resourceWebsite.logo}
                alt={resourceWebsite.name}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-12 w-12 text-muted-foreground/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>
        )}

        {/* 标签 - 推荐 */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          {resourceWebsite.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-medium text-white shadow-lg backdrop-blur-sm">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              ⭐ 推荐
            </span>
          )}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex flex-1 flex-col p-5">
        {/* 标题 */}
        <h3 className="mb-2 line-clamp-1 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
          {resourceWebsite.name}
        </h3>

        {/* 描述 */}
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {resourceWebsite.description || "暂无描述"}
        </p>

        {/* 底部信息 */}
        <div className="mt-auto space-y-3">
          {/* 统计信息 */}
          <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span>{resourceWebsite.category?.name || "未分类"}</span>
            </div>

            <div className="flex items-center gap-1">
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
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
              <span>{resourceWebsite.visit_count.toLocaleString()} 次访问</span>
            </div>
          </div>

          {/* 访问按钮 */}
          <button
            onClick={handleClick}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition hover:border-primary/40 hover:bg-primary/10"
          >
            <span>访问网站</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
