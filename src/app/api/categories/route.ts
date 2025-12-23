import { NextResponse } from "next/server";

import { CategoryService } from "@/lib/services/category.service";

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const categories = await CategoryService.getCategories();
    return NextResponse.json(categories);
  } catch (error: unknown) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}
