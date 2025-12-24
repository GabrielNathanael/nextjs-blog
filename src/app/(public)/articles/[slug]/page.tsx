import { notFound } from "next/navigation";
import BlogDetailContent from "@/components/BlogDetailContent";
import RelatedPosts from "@/components/RelatedPost";

interface Post {
  id: number;
  slug: string;
  title: string;
  content: string;
  thumbnail: string;
  shortDesc: string;
  createdAt: string;
  author: { id: number; name: string };
  category: { id: number; name: string };
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error("Post fetch error:", error);
    return null;
  }
}

async function getRelatedPosts(
  postId: number,
  categoryId: number,
  authorId: number
): Promise<Post[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(
      `${baseUrl}/api/related-posts?postId=${postId}&categoryId=${categoryId}&authorId=${authorId}&limit=3`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Related posts fetch error:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | BinaryStories`,
    description: post.shortDesc,
    openGraph: {
      title: post.title,
      description: post.shortDesc,
      images: [post.thumbnail],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(
    post.id,
    post.category.id,
    post.author.id
  );

  // Map to the structure expected by RelatedPosts component if necessary
  // Although structural typing usually works, we explicitly map to be safe and clean
  const formattedRelatedPosts = relatedPosts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: { name: p.category.name },
    author: { name: p.author.name },
    createdAt: p.createdAt,
    thumbnail: p.thumbnail,
  }));

  return (
    <div>
      <BlogDetailContent
        post={{
          title: post.title,
          author: post.author.name,
          createdAt: post.createdAt,
          thumbnail: post.thumbnail,
          content: post.content,
          category: post.category.name,
          slug: post.slug,
        }}
      />

      {formattedRelatedPosts.length > 0 && (
        <RelatedPosts posts={formattedRelatedPosts} />
      )}
    </div>
  );
}
