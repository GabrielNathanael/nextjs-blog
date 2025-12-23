import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import Newsletter from "@/components/Newsletter";
import EmptyState from "@/components/EmptyState";

export const revalidate = 60; // Revalidate every 60 seconds

interface Article {
  id: number;
  slug: string;
  title: string;
  content: string;
  thumbnail: string;
  shortDesc: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  categoryId: number;
  author: { id: number; name: string };
  category: { id: number; name: string };
}

interface Category {
  id: number;
  name: string;
}

interface HomepageData {
  featured: Article | null;
  highlights: Article[];
  grid: Article[];
  categories: Category[];
}

async function getHomepageData(): Promise<HomepageData> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/homepage`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch homepage data");
    }

    return await res.json();
  } catch (error) {
    console.error("Homepage data fetch error:", error);
    return { featured: null, highlights: [], grid: [], categories: [] };
  }
}

export default async function HomePage() {
  const { featured, highlights, grid, categories } = await getHomepageData();

  const isEmpty = !featured || !grid || grid.length === 0;

  return (
    <>
      {/* Hero Section - Show only if there's featured content */}
      {featured && highlights && highlights.length > 0 && (
        <HeroSection
          featured={{
            slug: featured.slug,
            thumbnail: featured.thumbnail,
            category: { name: featured.category?.name || "Uncategorized" },
            title: featured.title || "No title",
            author: { name: featured.author?.name || "Unknown" },
            createdAt: featured.createdAt,
          }}
          highlights={highlights.map((h) => ({
            slug: h.slug,
            thumbnail: h.thumbnail,
            category: { name: h.category?.name || "Uncategorized" },
            title: h.title || "No title",
            author: { name: h.author?.name || "Unknown" },
            createdAt: h.createdAt,
          }))}
        />
      )}

      {/* Category Section - Show only if there's content */}
      {grid && grid.length > 0 && (
        <CategorySection
          articles={grid.map((g) => ({
            id: g.id,
            slug: g.slug,
            title: g.title || "No title",
            category: { name: g.category?.name || "Uncategorized" },
            author: { name: g.author?.name || "Unknown" },
            createdAt: g.createdAt,
            thumbnail: g.thumbnail,
          }))}
          categories={categories}
        />
      )}

      {/* Empty State - Show if no content */}
      {isEmpty && (
        <div className="py-20">
          <EmptyState
            title="My blog is quiet... for now"
            message="I'm currently preparing some amazing stories for you. Please check back soon for my latest deep dives into technology and design."
            actionLabel="Browse My Categories"
            actionHref="/articles"
          />
        </div>
      )}

      {/* Newsletter Section */}
      <Newsletter />
    </>
  );
}
