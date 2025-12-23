import { NextRequest, NextResponse } from "next/server";

import { PostService, PostFilters } from "@/lib/services/post.service";

// GET /api/posts - Get all posts (with filtering and pagination)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const published = searchParams.get("published");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");
    const page = searchParams.get("page");

    const filters: PostFilters = {
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      published: published ? published === "true" : undefined,
      search: search || undefined,
      limit: limit ? parseInt(limit) : 10,
      page: page ? parseInt(page) : 1,
    };

    const result = await PostService.getPosts(filters);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch posts",
      },
      { status: 500 }
    );
  }
}
