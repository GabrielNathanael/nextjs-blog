import Link from "next/link";
import ArticleCard from "./ArticleCard";

interface Post {
  id: number;
  title: string;
  slug: string;
  category: { name: string };
  author: { name: string };
  createdAt: string;
  thumbnail: string;
}

interface RelatedPostsProps {
  posts: Post[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
          Related Articles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post) => (
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
                  date: new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                  image: post.thumbnail,
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
