import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4">
        {/* Header */}
        <header className="mb-14">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>

        {/* Content – manual spacing (Tailwind v4 safe) */}
        <section className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            This website is a personal blog and writing space. Your privacy is
            important to me, and this page explains what data is collected and
            how it is used.
          </p>

          <h2 className="pt-6 text-lg font-semibold text-gray-900">
            Information I Collect
          </h2>
          <p>
            If you choose to subscribe to the newsletter, I collect your email
            address solely for the purpose of sending updates when new posts are
            published.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Email address (provided voluntarily)</li>
          </ul>

          <h2 className="pt-6 text-lg font-semibold text-gray-900">
            How Your Information Is Used
          </h2>
          <p>Your email address is used only to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Send newsletter emails</li>
            <li>Notify you when new content is published</li>
          </ul>
          <p>
            I do not sell, rent, or share your personal information with third
            parties for marketing purposes.
          </p>

          <h2 className="pt-6 text-lg font-semibold text-gray-900">
            Third-Party Services
          </h2>
          <p>
            Newsletter emails are delivered using a third-party email service
            provider. Your email address is stored securely and used only to
            deliver subscribed content.
          </p>

          <h2 className="pt-6 text-lg font-semibold text-gray-900">
            Cookies & Analytics
          </h2>
          <p>
            This website does not use cookies for tracking or advertising
            purposes. Basic analytics may be used to understand general traffic
            patterns, without identifying individual visitors.
          </p>

          <h2 className="pt-6 text-lg font-semibold text-gray-900">
            Your Rights
          </h2>
          <p>You may unsubscribe from the newsletter at any time by:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Using the unsubscribe link in any newsletter email</li>
            <li>Contacting me directly if needed</li>
          </ul>

          <h2 className="pt-6 text-lg font-semibold text-gray-900">
            Data Retention
          </h2>
          <p>
            Your email address is retained only for as long as you remain
            subscribed to the newsletter.
          </p>

          <h2 className="pt-6 text-lg font-semibold text-gray-900">
            Changes to This Policy
          </h2>
          <p>
            This privacy policy may be updated occasionally. Any changes will be
            reflected on this page with an updated date.
          </p>

          <h2 className="pt-6 text-lg font-semibold text-gray-900">Contact</h2>
          <p>
            If you have questions about this privacy policy, you can reach out
            via the contact information provided on this website.
          </p>
        </section>

        {/* Footer */}
        <div className="mt-20">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
