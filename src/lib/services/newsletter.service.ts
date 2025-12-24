import { Resend } from "resend";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { PostNewsletterEmail } from "@/emails/PostNewsletterEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export class NewsletterService {
  // Subscribe email to newsletter
  static async subscribeEmail(email: string) {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: "Invalid email format" };
      }

      // Add contact to Resend (global contacts, no audience needed)
      const result = await resend.contacts.create({
        email: email.toLowerCase().trim(),
      });

      return { success: true, data: result };
    } catch (error: unknown) {
      console.error("Subscribe error:", error);

      // Handle duplicate email
      if (
        error instanceof Error &&
        (error.message?.includes("already exists") ||
          error.message?.includes("duplicate"))
      ) {
        return { success: false, error: "Email already subscribed" };
      }

      // Handle other errors
      return {
        success: false,
        error: "Failed to subscribe. Please try again.",
      };
    }
  }

  // Send welcome email to new subscriber
  static async sendWelcomeEmail(email: string) {
    try {
      const result = await resend.emails.send({
        from: "BinaryStories <onboarding@resend.dev>", // Change to your verified domain
        to: email,
        subject: "Welcome to BinaryStories Newsletter! 🎉",
        react: WelcomeEmail({ email }),
      });

      return { success: true, data: result };
    } catch (error: unknown) {
      console.error("Failed to send welcome email:", error);

      // Don't fail subscription if welcome email fails
      return {
        success: false,
        error: "Subscribed but failed to send welcome email",
        shouldNotify: false, // Don't show error to user
      };
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
      // Get all contacts
      const contacts = await resend.contacts.list();

      if (
        !contacts.data ||
        !Array.isArray(contacts.data) ||
        contacts.data.length === 0
      ) {
        return {
          success: false,
          error: "No subscribers found",
          sentTo: 0,
        };
      }

      const emails = contacts.data.map((contact) => contact.email);

      // Send email using React Email template
      const result = await resend.emails.send({
        from: "BinaryStories <onboarding@resend.dev>", // Change to your verified domain
        to: emails,
        subject: `New Article: ${post.title}`,
        react: PostNewsletterEmail({ post }),
      });

      return {
        success: true,
        data: result,
        sentTo: emails.length,
      };
    } catch (error: unknown) {
      console.error("Failed to send newsletter:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to send newsletter"
      );
    }
  }

  // Get subscriber count
  static async getSubscriberCount() {
    try {
      const contacts = await resend.contacts.list();
      return contacts.data && Array.isArray(contacts.data)
        ? contacts.data.length
        : 0;
    } catch (error) {
      console.error("Failed to get subscriber count:", error);
      return 0;
    }
  }
}
