import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardPostService } from "@/lib/services/dashboard-post.service";

// GET post by ID (protected)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const post = await DashboardPostService.getPostById(parseInt(id));

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("GET /api/dashboard/posts/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT update post (protected)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, content, thumbnail, shortDesc, categoryId, published } =
      body;

    // Validate shortDesc length if provided
    if (shortDesc && shortDesc.length > 120) {
      return NextResponse.json(
        { error: "Short description must be 120 characters or less" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (thumbnail) updateData.thumbnail = thumbnail;
    if (shortDesc) updateData.shortDesc = shortDesc;
    if (categoryId) updateData.categoryId = parseInt(categoryId);
    if (typeof published === "boolean") updateData.published = published;

    const post = await DashboardPostService.updatePost(
      parseInt(id),
      updateData
    );

    return NextResponse.json(post);
  } catch (error) {
    console.error("PUT /api/dashboard/posts/[id] error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update post",
      },
      { status: 500 }
    );
  }
}

// DELETE post (protected)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await DashboardPostService.deletePost(parseInt(id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/dashboard/posts/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
