import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/content/article-card";
import { SectionHeader } from "@/components/content/section-header";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { listArticleCategories, listArticles } from "@/lib/api/articles";

const PAGE_SIZE = 9;

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const categories = await listArticleCategories();
  const category = categories.find((item) => item.slug === params.slug);

  if (!category) {
    return {};
  }

  return {
    title: `${category.name} · 资源分类`,
    description:
      category.description ??
      `Lenjoy 站点中与 ${category.name} 相关的精选资源。`,
  };
}

export default async function ArticleCategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const page = Number(searchParams.page ?? "1") || 1;

  const [categories, articleResponse] = await Promise.all([
    listArticleCategories(),
    listArticles({ page, pageSize: PAGE_SIZE, category: params.slug }),
  ]);

  const category = categories.find((item) => item.slug === params.slug);

  if (!category) {
    notFound();
  }

  const totalPages = Math.max(1, Math.ceil(articleResponse.count / PAGE_SIZE));

  return (
    <div className="container space-y-10 py-12">
      <div className="space-y-4">
        <Link
          href="/articles"
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← 返回资源列表
        </Link>
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
            {category.name}
          </h1>
          {category.description ? (
            <p className="max-w-2xl text-sm text-muted-foreground">
              {category.description}
            </p>
          ) : null}
        </header>
      </div>

      <section className="space-y-6">
        <SectionHeader
          title="分类相关资源"
          description={`共收录 ${articleResponse.count} 篇与「${category.name}」相关的资源。`}
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articleResponse.results.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  page > 1
                    ? `/articles/categories/${params.slug}?page=${page - 1}`
                    : undefined
                }
                aria-disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href={`/articles/categories/${params.slug}?page=${pageNumber}`}
                    isActive={pageNumber === page}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                href={
                  page < totalPages
                    ? `/articles/categories/${params.slug}?page=${page + 1}`
                    : undefined
                }
                aria-disabled={page >= totalPages}
                className={
                  page >= totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
