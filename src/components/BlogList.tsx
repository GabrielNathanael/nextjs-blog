"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ArticleCard from "./ArticleCard";
import Newsletter from "./Newsletter";
import EmptyState from "./EmptyState";
import Link from "next/link";

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
  _count: { posts: number };
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
  currentSearch?: string;
}

export default function BlogList({
  initialPosts,
  pagination,
  categories,
  currentCategoryId,
  currentSearch,
}: BlogListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (categoryId?: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categoryId) {
      params.set("categoryId", categoryId.toString());
    } else {
      params.delete("categoryId");
    }

    // Reset to page 1 when changing category
    params.delete("page");

    router.push(`/articles?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/articles?${params.toString()}`);
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            ALL ARTICLES
          </h1>
          {currentSearch && (
            <p className="text-gray-600">
              Search results for:{" "}
              <span className="font-semibold">&quot;{currentSearch}&quot;</span>
            </p>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 md:mb-12">
          <button
            onClick={() => handleCategoryChange()}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !currentCategoryId
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentCategoryId === category.id
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {category.name} ({category._count.posts})
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {initialPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {initialPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/articles/${post.slug}`}
                  className="group transition-transform duration-300 hover:scale-105"
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => {
                  // Show first, last, current, and adjacent pages
                  const shouldShow =
                    page === 1 ||
                    page === pagination.totalPages ||
                    Math.abs(page - pagination.page) <= 1;

                  if (!shouldShow) {
                    // Show ellipsis
                    if (
                      page === pagination.page - 2 ||
                      page === pagination.page + 2
                    ) {
                      return (
                        <span key={page} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pagination.page === page
                          ? "bg-gray-900 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}

            {/* Results Info */}
            <div className="text-center mt-6 text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.limit + 1} -{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} posts
            </div>

            {/* Newsletter Section */}
            <div className="mt-10 border-t border-gray-100 pt-4">
              <Newsletter />
            </div>
          </>
        ) : (
          <div className="space-y-12">
            <EmptyState
              title={currentSearch ? "No results found" : "No posts here yet"}
              message={
                currentSearch
                  ? `I couldn't find any matches for "${currentSearch}". Try different keywords or browse all categories.`
                  : "This category doesn't have any posts yet. Why not explore my other stories?"
              }
              actionLabel={
                currentSearch || currentCategoryId
                  ? "View All Posts"
                  : "Back to Home"
              }
              onAction={
                currentSearch || currentCategoryId
                  ? () => router.push("/articles")
                  : undefined
              }
              actionHref={
                !(currentSearch || currentCategoryId) ? "/" : undefined
              }
            />

            {/* Newsletter even when empty */}
            <div className="border-t border-gray-100 pt-8">
              <Newsletter />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
