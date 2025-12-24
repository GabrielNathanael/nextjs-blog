// ================================
// app/articles/page.tsx
// ================================
import BlogList from "@/components/BlogList";

export const revalidate = 60;

async function getCategories() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/categories`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Fetch categories error:", error);
    return [];
  }
}

async function getPosts(params: {
  categoryId?: string;
  category?: string; // NEW: support category by name
  page?: string;
  search?: string;
}) {
  try {
    const { categoryId, category, page, search } = params;
    const queryParams = new URLSearchParams();

    // Priority: categoryId > category(name)
    if (categoryId) queryParams.set("categoryId", categoryId);
    else if (category) queryParams.set("category", category);

    if (page) queryParams.set("page", page);
    if (search) queryParams.set("search", search);
    queryParams.set("limit", "9");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts?${queryParams.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch posts error:", error);
    return {
      posts: [],
      pagination: { total: 0, page: 1, limit: 9, totalPages: 0 },
    };
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: {
    categoryId?: string;
    category?: string; // NEW
    page?: string;
    search?: string;
  };
}) {
  const sp = await searchParams;

  const [categories, postsData] = await Promise.all([
    getCategories(),
    getPosts(sp),
  ]);

  return (
    <div>
      <BlogList
        initialPosts={postsData.posts}
        pagination={postsData.pagination}
        categories={categories}
        currentCategoryId={sp.categoryId ? parseInt(sp.categoryId) : undefined}
        currentCategory={sp.category}
        currentSearch={sp.search}
      />
    </div>
  );
}

// ================================
// app/api/posts/route.ts
// ================================
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 9);
    const categoryId = searchParams.get("categoryId");
    const category = searchParams.get("category"); // NEW
    const search = searchParams.get("search");

    const where: Prisma.PostWhereInput = {
      published: true,
    };

    // Priority: categoryId > category(name)
    if (categoryId) {
      where.categoryId = Number(categoryId);
    } else if (category) {
      where.category = { name: category };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { shortDesc: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        include: {
          category: true,
          author: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
