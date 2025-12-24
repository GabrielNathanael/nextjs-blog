import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PostService } from "@/lib/services/post.service";

// GET /api/dashboard/posts - Get all posts for dashboard (including drafts)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all posts (published AND drafts) for the logged-in user
    const result = await PostService.getPosts({
      published: undefined, // Get both published and drafts
      page: 1,
      limit: 1000, // Get all posts for dashboard
    });

    return NextResponse.json(result.posts);
  } catch (error: unknown) {
    console.error("GET /api/dashboard/posts error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch posts",
      },
      { status: 500 }
    );
  }
}
