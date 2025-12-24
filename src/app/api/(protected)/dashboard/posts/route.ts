import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardPostService } from "@/lib/services/dashboard-post.service";

// GET all posts (protected)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await DashboardPostService.getAllPosts(
      parseInt(session.user.id)
    );

    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/dashboard/posts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST create new post (protected)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, thumbnail, shortDesc, categoryId, published } =
      body;

    if (!title || !content || !thumbnail || !shortDesc || !categoryId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate shortDesc length (max 120 chars)
    if (shortDesc.length > 120) {
      return NextResponse.json(
        { error: "Short description must be 120 characters or less" },
        { status: 400 }
      );
    }

    const post = await DashboardPostService.createPost({
      title,
      content,
      thumbnail,
      shortDesc,
      categoryId: parseInt(categoryId),
      authorId: parseInt(session.user.id),
      published: published ?? false,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("POST /api/dashboard/posts error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create post",
      },
      { status: 500 }
    );
  }
}
