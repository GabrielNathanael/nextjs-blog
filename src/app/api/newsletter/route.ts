import { NextRequest, NextResponse } from "next/server";
import { NewsletterService } from "@/lib/services/newsletter.service";

// POST /api/newsletter - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    // Subscribe email
    const result = await NewsletterService.subscribeEmail(email);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 409 } // Conflict (already exists)
      );
    }

    // Send welcome email (optional, can be removed if not needed)
    await NewsletterService.sendWelcomeEmail(email);

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter",
    });
  } catch (error: any) {
    console.error("POST /api/newsletter error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to subscribe" },
      { status: 500 }
    );
  }
}
