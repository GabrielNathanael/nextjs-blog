import { NextResponse } from "next/server";
import { PostService } from "@/lib/services/post.service";

// GET /api/homepage - Get homepage data
export async function GET() {
  try {
    const data = await PostService.getHomepageData();

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("GET /api/homepage error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch homepage data",
      },
      { status: 500 }
    );
  }
}
