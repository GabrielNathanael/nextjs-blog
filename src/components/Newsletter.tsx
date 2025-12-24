"use client";

import { useState } from "react";
import { Mail, Check, X } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setMessage(null);

    // Validate email on frontend
    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    if (!validateEmail(email.trim())) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "🎉 Successfully subscribed! Check your email for confirmation.",
        });
        setEmail("");
      } else {
        // Handle specific error messages
        if (data.error === "Email already subscribed") {
          setMessage({
            type: "error",
            text: "This email is already subscribed to our newsletter.",
          });
        } else {
          setMessage({
            type: "error",
            text: data.error || "Failed to subscribe. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Newsletter error:", error);
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-6 py-12 shadow-2xl md:px-12 md:py-20">
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Icon */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <Mail className="h-8 w-8 text-white" />
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              Stay in the loop
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-300">
              Subscribe to our newsletter for the latest articles, insights, and
              updates delivered straight to your inbox.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-10 w-full max-w-md">
              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                  className="w-full rounded-xl border-0 bg-white/10 px-5 py-3.5 text-white placeholder-gray-400 ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm md:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-none rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Subscribing
                    </span>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
            </form>

            {/* Success/Error Message */}
            {message && (
              <div
                className={`mt-6 rounded-lg px-4 py-3 text-sm flex items-center gap-2 max-w-md w-full ${
                  message.type === "success"
                    ? "bg-green-500/20 text-green-200 border border-green-500/30"
                    : "bg-red-500/20 text-red-200 border border-red-500/30"
                }`}
                role="alert"
              >
                {message.type === "success" ? (
                  <Check className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <X className="h-5 w-5 flex-shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Privacy Link */}
            <p className="mt-6 text-xs text-gray-400">
              We care about your data. Read our{" "}
              <a
                href="/privacy"
                className="font-medium text-white hover:underline transition-colors"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
