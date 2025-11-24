"use client";

import { useEffect } from "react";
import { incrementArticleView } from "@/lib/api/articles";

interface ArticleViewTrackerProps {
  id: number;
}

export function ArticleViewTracker({ id }: ArticleViewTrackerProps) {
  useEffect(() => {
    // 页面加载时调用 API 增加浏览量
    incrementArticleView(id).catch((error) => {
      console.error("Failed to increment article view:", error);
    });
  }, [id]);

  return null;
}
