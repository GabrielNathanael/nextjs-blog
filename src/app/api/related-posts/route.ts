import { NextRequest, NextResponse } from "next/server";
import { PostService } from "@/lib/services/post.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const categoryId = searchParams.get("categoryId");
    const authorId = searchParams.get("authorId");
    const limit = searchParams.get("limit");

    if (!postId || !categoryId || !authorId) {
      return NextResponse.json(
        { error: "Missing required parameters: postId, categoryId, authorId" },
        { status: 400 }
      );
    }

    const posts = await PostService.getRelatedPosts(
      parseInt(postId),
      parseInt(categoryId),
      parseInt(authorId),
      limit ? parseInt(limit) : 3
    );

    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/related-posts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch related posts" },
      { status: 500 }
    );
  }
}
