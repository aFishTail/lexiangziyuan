"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ArticleCategory, Tag } from "@/lib/types/content";

interface ArticleFiltersProps {
  categories: ArticleCategory[];
  tags: Tag[];
}

export function ArticleFilters({ categories, tags }: ArticleFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") || "";
  const selectedTags =
    searchParams.get("tags")?.split(",").filter(Boolean) || [];
  const currentPage = searchParams.get("page") || "1";
  const ordering = searchParams.get("ordering") || "-created_time";

  const hasFilters = selectedCategory || selectedTags.length > 0;

  // 更新URL参数
  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // 重置到第一页
    params.set("page", "1");

    router.push(`/articles?${params.toString()}`);
  };

  // 选择分类
  const handleCategoryChange = (categoryId: string) => {
    updateFilters({
      category: categoryId === selectedCategory ? null : categoryId,
      tags: selectedTags.join(",") || null,
      ordering,
    });
  };

  // 切换标签
  const handleTagToggle = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter((t) => t !== tagId)
      : [...selectedTags, tagId];

    updateFilters({
      category: selectedCategory || null,
      tags: newTags.join(",") || null,
      ordering,
    });
  };

  // 重置筛选
  const handleReset = () => {
    router.push(`/articles?ordering=${ordering}`);
  };

  return (
    <div className="space-y-6 rounded-xl border bg-card p-6">
      {/* 分类筛选 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">分类</h3>
          {selectedCategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCategoryChange(selectedCategory)}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              清除
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={
                selectedCategory === String(category.id) ? "default" : "outline"
              }
              className="cursor-pointer transition-colors hover:bg-primary/90 hover:text-primary-foreground"
              onClick={() => handleCategoryChange(String(category.id))}
            >
              {category.name}
              {category.article_count !== undefined && (
                <span className="ml-1 text-xs opacity-60">
                  ({category.article_count})
                </span>
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* 标签筛选 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">标签</h3>
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                updateFilters({
                  category: selectedCategory || null,
                  tags: null,
                  ordering,
                })
              }
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              清除全部
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(String(tag.id));
            return (
              <Badge
                key={tag.id}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer transition-colors hover:bg-primary/90 hover:text-primary-foreground"
                onClick={() => handleTagToggle(String(tag.id))}
              >
                {tag.name}
                {tag.article_count !== undefined && (
                  <span className="ml-1 text-xs opacity-60">
                    ({tag.article_count})
                  </span>
                )}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* 重置按钮 */}
      {hasFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="w-full"
        >
          <X className="mr-2 h-4 w-4" />
          重置筛选
        </Button>
      )}
    </div>
  );
}
