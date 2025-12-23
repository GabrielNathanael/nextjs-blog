import { NextRequest, NextResponse } from "next/server";
import { PostService } from "@/lib/services/post.service";

// GET /api/search?q=query - Global search
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    // Minimum 2 characters to search
    if (query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 10;

    const results = await PostService.searchPosts(query, limit);

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to search" },
      { status: 500 }
    );
  }
}
