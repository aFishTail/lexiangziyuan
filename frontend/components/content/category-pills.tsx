import Link from "next/link";

import type { BaseCategory } from "@/lib/types/content";

interface CategoryPillsProps {
  categories: BaseCategory[];
  basePath: string;
}

export function CategoryPills({ categories, basePath }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`${basePath}?category=${category.id}`}
          className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/60 hover:text-primary"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
