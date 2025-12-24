"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ArticleCard from "./ArticleCard";
import Newsletter from "./Newsletter";
import EmptyState from "./EmptyState";

interface Post {
  id: number;
  title: string;
  slug: string;
  category: { name: string };
  author: { name: string };
  createdAt: string;
  thumbnail: string;
}

interface Category {
  id: number;
  name: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface BlogListProps {
  initialPosts: Post[];
  pagination: Pagination;
  categories: Category[];
  currentCategoryId?: number;
  currentCategory?: string;
  currentSearch?: string;
}

export default function BlogList({
  initialPosts,
  pagination,
  categories,
  currentCategoryId,
  currentCategory,
  currentSearch,
}: BlogListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value);
    });

    router.push(`/articles?${params.toString()}`);
  };

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4">
        {/* Personal Editorial Header */}
        <header className="mb-16 text-center">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-5">
            Notes & Writing
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A personal collection of thoughts, lessons, experiments, and things
            I don’t want to forget.
          </p>

          {currentSearch && (
            <p className="mt-5 text-sm text-gray-500">
              Searching for{" "}
              <span className="font-medium">“{currentSearch}”</span>
            </p>
          )}
        </header>

        {/* Category Navigation – personal tone */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm mb-20">
          <button
            onClick={() =>
              updateParams({ categoryId: null, category: null, page: null })
            }
            className={`transition-colors ${
              !currentCategoryId && !currentCategory
                ? "text-gray-900 font-medium underline underline-offset-4"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                updateParams({
                  categoryId: String(cat.id),
                  category: null,
                  page: null,
                })
              }
              className={`transition-colors ${
                currentCategoryId === cat.id || currentCategory === cat.name
                  ? "text-gray-900 font-medium underline underline-offset-4"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>

        {/* Articles */}
        {initialPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
              {initialPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/articles/${post.slug}`}
                  className="group"
                >
                  <ArticleCard
                    article={{
                      id: post.id,
                      title: post.title,
                      category: post.category.name,
                      author: post.author.name,
                      date: new Date(post.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      ),
                      image: post.thumbnail,
                    }}
                  />
                </Link>
              ))}
            </div>

            {/* Pagination – calm & blog-like */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-24 text-sm">
                <button
                  disabled={pagination.page === 1}
                  onClick={() =>
                    updateParams({ page: String(pagination.page - 1) })
                  }
                  className="text-gray-500 hover:text-gray-900 disabled:opacity-30"
                >
                  ← Newer posts
                </button>

                <span className="text-gray-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() =>
                    updateParams({ page: String(pagination.page + 1) })
                  }
                  className="text-gray-500 hover:text-gray-900 disabled:opacity-30"
                >
                  Older posts →
                </button>
              </div>
            )}

            {/* Newsletter – personal invite */}
            <div className="mt-28 border-t border-gray-100 pt-14">
              <Newsletter />
            </div>
          </>
        ) : (
          <div className="space-y-20">
            <EmptyState
              title={currentSearch ? "Nothing found" : "No notes yet"}
              message={
                currentSearch
                  ? `I couldn’t find anything matching “${currentSearch}”. Maybe try another word.`
                  : "This space is still empty. Writing takes time — it’ll fill up."
              }
              actionLabel="View all writing"
              onAction={() => updateParams({ categoryId: null, page: null })}
            />

            <div className="border-t border-gray-100 pt-14">
              <Newsletter />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
