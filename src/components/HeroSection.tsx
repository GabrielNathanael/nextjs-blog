import Link from "next/link";
import FeaturedArticle from "./FeaturedArticle";
import MiniArticleCard from "./MiniArticleCard";

interface HeroSectionProps {
  featured: {
    slug: string;
    thumbnail: string;
    category: { name: string };
    title: string;
    author: { name: string };
    createdAt: string;
  };
  highlights: {
    slug: string;
    thumbnail: string;
    category: { name: string };
    title: string;
    author: { name: string };
    createdAt: string;
  }[];
}

export default function HeroSection({
  featured,
  highlights,
}: HeroSectionProps) {
  return (
    <section className="bg-gray-50 py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-6">
          Latest Posts
        </h1>

        <div className="space-y-2 md:space-y-4">
          {/* Featured Article */}
          {featured && (
            <Link
              href={`/articles/${featured.slug}`}
              className="block relative"
            >
              <FeaturedArticle
                image={featured.thumbnail}
                category={featured.category.name}
                title={featured.title}
                author={featured.author.name}
                date={new Date(featured.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            </Link>
          )}

          {/* Mini articles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
            {highlights?.map((article, index) => (
              <Link
                key={index}
                href={`/articles/${article.slug}`}
                className="block relative"
              >
                <MiniArticleCard
                  image={article.thumbnail}
                  category={article.category.name}
                  title={article.title}
                  author={article.author.name}
                  date={new Date(article.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
