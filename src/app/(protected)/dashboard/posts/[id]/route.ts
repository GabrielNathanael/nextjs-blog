import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PostService } from "@/lib/services/post.service";

// DELETE /api/dashboard/posts/[id] - Delete post from dashboard
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
    const postId = parseInt(id);

    // Check if post exists
    const post = await PostService.getPostById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete post
    await PostService.deletePost(postId);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("DELETE /api/dashboard/posts/[id] error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete post",
      },
      { status: 500 }
    );
  }
}
