"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useState,
  useEffect,
  useRef,
  type FormEvent,
} from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  getSearchHistory,
  addSearchHistory,
  removeSearchHistory,
  clearSearchHistory,
  type SearchHistoryItem,
} from "@/lib/api/search";

interface SearchFormProps {
  initialQuery?: string;
}

export function SearchForm({ initialQuery = "" }: SearchFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 加载搜索历史
  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  // 自动聚焦搜索框
  useEffect(() => {
    if (!initialQuery) {
      inputRef.current?.focus();
    }
  }, [initialQuery]);

  // 防抖处理（500ms）
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.trim() && value.trim() !== initialQuery) {
        // 这里可以添加实时搜索建议功能
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value, initialQuery]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = value.trim();
      if (!trimmed) {
        router.push("/search");
        return;
      }

      // 添加到搜索历史
      addSearchHistory(trimmed);
      setSearchHistory(getSearchHistory());

      // 执行搜索
      const query = new URLSearchParams({ q: trimmed });
      router.push(`/search?${query.toString()}`);
      setShowHistory(false);
    },
    [router, value]
  );

  const handleHistoryClick = useCallback(
    (keyword: string) => {
      setValue(keyword);
      const query = new URLSearchParams({ q: keyword });
      router.push(`/search?${query.toString()}`);
      setShowHistory(false);
    },
    [router]
  );

  const handleRemoveHistory = useCallback(
    (keyword: string, event: React.MouseEvent) => {
      event.stopPropagation();
      removeSearchHistory(keyword);
      setSearchHistory(getSearchHistory());
    },
    []
  );

  const handleClearHistory = useCallback(() => {
    clearSearchHistory();
    setSearchHistory([]);
  }, []);

  return (
    <div className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => {
              // 延迟隐藏，以便点击历史记录能够触发
              setTimeout(() => setShowHistory(false), 200);
            }}
            placeholder="输入关键词搜索资源"
            className="h-11 pr-10"
            aria-label="站内搜索"
            autoComplete="off"
          />
          {value && (
            <button
              type="button"
              onClick={() => setValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="清除搜索"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" size="lg">
          搜索
        </Button>
      </form>

      {/* 搜索历史下拉框 */}
      {showHistory && searchHistory.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-border bg-card shadow-lg sm:right-auto sm:w-[calc(100%-120px)]">
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="text-sm font-medium text-foreground">
              搜索历史
            </span>
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              清空
            </button>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2">
            {searchHistory.map((item, index) => (
              <div
                key={index}
                onClick={() => handleHistoryClick(item.keyword)}
                className="group flex cursor-pointer items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
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
                  <span className="text-sm text-foreground">
                    {item.keyword}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleRemoveHistory(item.keyword, e)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="删除历史记录"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
