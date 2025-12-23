"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ArticleCard from "./ArticleCard";

interface Article {
  id: number;
  title: string;
  category: { name: string };
  author: { name: string };
  createdAt: string;
  thumbnail: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
}

interface CategorySectionProps {
  articles: Article[];
  categories?: Category[];
}

export default function CategorySection({
  articles,
  categories = [],
}: CategorySectionProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const displayCategories = [
    "All Categories",
    ...categories.map((c) => c.name),
  ];

  const handleCategoryClick = (catName: string) => {
    setSelectedCategory(catName); // Tetap update state lokal agar UI berubah sebentar

    if (catName === "All Categories") {
      router.push("/articles");
      return;
    }

    const category = categories.find((c) => c.name === catName);
    if (category) {
      router.push(`/articles?categoryId=${category.id}`);
    }
  };

  const filteredArticles =
    selectedCategory === "All Categories"
      ? articles
      : articles.filter((a) => a.category.name === selectedCategory);

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-lg md:text-2xl font-bold">
            Not fast updates. Not hot takes. Just thoughtful writing.
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8">
          {displayCategories.map((cat, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Artikel */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {filteredArticles.slice(0, 6).map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group transition-transform duration-300 hover:scale-105"
            >
              <ArticleCard
                article={{
                  id: article.id,
                  title: article.title,
                  category: article.category.name,
                  author: article.author.name,
                  date: new Date(article.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  ),
                  image: article.thumbnail,
                }}
              />
            </Link>
          ))}
        </div>

        {/* View All Article Button */}
        <div className="flex justify-center pt-8">
          <Link
            href="/articles"
            className="inline-flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium transition-colors cursor-pointer text-sm md:text-base"
          >
            <span>View All Posts</span>
            <svg
              className="w-3 h-3 md:w-4 md:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
