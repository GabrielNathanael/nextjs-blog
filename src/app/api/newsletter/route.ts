import { NextRequest, NextResponse } from "next/server";
import { NewsletterService } from "@/lib/services/newsletter.service";

// POST /api/newsletter - Subscribe to newsletter (PUBLIC)
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

    // Trim and lowercase email
    const cleanEmail = email.trim().toLowerCase();

    // Subscribe email to Resend contacts
    const result = await NewsletterService.subscribeEmail(cleanEmail);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to subscribe" },
        { status: result.error === "Email already subscribed" ? 409 : 500 }
      );
    }

    // Send welcome email (don't fail subscription if this fails)
    await NewsletterService.sendWelcomeEmail(cleanEmail);

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
