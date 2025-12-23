import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NewsletterService } from "@/lib/services/newsletter.service";
import { PostService } from "@/lib/services/post.service";

// POST /api/newsletter/send - Send newsletter about a post (protected)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    // Fetch post data
    const post = await PostService.getPostById(parseInt(postId));

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if post is published
    if (!post.published) {
      return NextResponse.json(
        { error: "Cannot send newsletter for unpublished post" },
        { status: 400 }
      );
    }

    // Send newsletter
    const result = await NewsletterService.sendPostNewsletter({
      title: post.title,
      slug: post.slug,
      shortDesc: post.shortDesc,
      thumbnail: post.thumbnail,
      author: { name: post.author.name },
      category: { name: post.category.name },
    });

    if (!result.success) {
      return NextResponse.json(
        { error: (result as any).error || "Failed to send newsletter" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${result.sentTo} subscribers`,
      sentTo: result.sentTo,
    });
  } catch (error: unknown) {
    console.error("POST /api/newsletter/send error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to send newsletter",
      },
      { status: 500 }
    );
  }
}
