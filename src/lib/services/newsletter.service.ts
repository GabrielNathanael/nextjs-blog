import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export class NewsletterService {
  // Subscribe email to newsletter
  static async subscribeEmail(email: string) {
    try {
      // NEW: No audience_id needed, contacts are now global!
      const result = await resend.contacts.create({
        email,
      });

      return { success: true, data: result };
    } catch (error: unknown) {
      // Handle duplicate email
      if (error instanceof Error && error.message?.includes("already exists")) {
        return { success: false, error: "Email already subscribed" };
      }

      throw error;
    }
  }

  // Send welcome email to new subscriber
  static async sendWelcomeEmail(email: string) {
    try {
      const result = await resend.emails.send({
        from: "BinaryStories <onboarding@resend.dev>", // Use Resend's dev email for testing
        to: email,
        subject: "Welcome to BinaryStories Newsletter!",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Welcome to BinaryStories! 🎉</h1>
            <p>Thank you for subscribing to our newsletter.</p>
            <p>You'll receive the latest articles, insights, and updates straight to your inbox.</p>
            <p>Stay tuned!</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              You're receiving this because you subscribed to BinaryStories newsletter.
            </p>
          </div>
        `,
      });

      return { success: true, data: result };
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      return { success: false, error: "Failed to send welcome email" };
    }
  }

  // Send newsletter about a specific post using Broadcasts
  static async sendPostNewsletter(post: {
    title: string;
    slug: string;
    shortDesc: string;
    thumbnail: string;
    author: { name: string };
    category: { name: string };
  }) {
    try {
      // NEW: Use Broadcasts API to send to all contacts
      const result = await resend.broadcasts.create({
        audienceId: process.env.RESEND_AUDIENCE_ID || "",
        from: "BinaryStories <onboarding@resend.dev>", // Use Resend's dev email for testing
        subject: `New Article: ${post.title}`,
        html: this.generatePostEmailHTML(post),
        text: `New Article: ${post.title}\n\n${post.shortDesc}\n\nRead more at: ${process.env.NEXT_PUBLIC_BASE_URL}/articles/${post.slug}`,
      });

      // Get total contacts count for reporting
      const contacts = await resend.contacts.list();
      const totalContacts =
        contacts.data && "data" in contacts.data
          ? (contacts.data.data as unknown[]).length
          : 0;

      return {
        success: true,
        data: result,
        sentTo: totalContacts,
      };
    } catch (error) {
      console.error("Failed to send newsletter:", error);
      throw error;
    }
  }

  // Generate email HTML template for post
  private static generatePostEmailHTML(post: {
    title: string;
    slug: string;
    shortDesc: string;
    thumbnail: string;
    author: { name: string };
    category: { name: string };
  }) {
    const postUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/articles/${post.slug}`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px;">
                      <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #111827;">BinaryStories</h1>
                    </td>
                  </tr>

                  <!-- Thumbnail -->
                  <tr>
                    <td style="padding: 0 40px;">
                      <img src="${post.thumbnail}" alt="${
      post.title
    }" style="width: 100%; height: auto; border-radius: 8px;">
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 30px 40px;">
                      <p style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600;">${
                        post.category.name
                      }</p>
                      <h2 style="margin: 0 0 15px 0; font-size: 28px; font-weight: bold; color: #111827; line-height: 1.3;">${
                        post.title
                      }</h2>
                      <p style="margin: 0 0 20px 0; font-size: 16px; color: #4b5563; line-height: 1.6;">${
                        post.shortDesc
                      }</p>
                      <p style="margin: 0 0 30px 0; font-size: 14px; color: #6b7280;">By ${
                        post.author.name
                      }</p>
                      
                      <!-- CTA Button -->
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="border-radius: 6px; background-color: #111827;">
                            <a href="${postUrl}" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">Read Article</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">You're receiving this because you subscribed to BinaryStories newsletter.</p>
                      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                        <a href="${postUrl}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> | 
                        <a href="${
                          process.env.NEXT_PUBLIC_BASE_URL ||
                          "http://localhost:3000"
                        }" style="color: #6b7280; text-decoration: underline;">Visit Website</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }
}
