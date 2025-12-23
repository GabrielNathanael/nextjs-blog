"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Successfully subscribed! Check your email.",
        });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to subscribe",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-6 py-12 shadow-2xl md:px-12 md:py-20">
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              Stay in the loop
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-300">
              Subscribe to my newsletter for the latest posts, insights, and
              updates delivered straight to your inbox.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 flex w-full max-w-md flex-col gap-4 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
                className="w-full rounded-xl border-0 bg-white/10 px-5 py-3.5 text-white placeholder-gray-400 ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm md:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex-none rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>

            {/* Success/Error Message */}
            {message && (
              <div
                className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                  message.type === "success"
                    ? "bg-green-500/20 text-green-200 border border-green-500/30"
                    : "bg-red-500/20 text-red-200 border border-red-500/30"
                }`}
              >
                {message.text}
              </div>
            )}

            <p className="mt-4 text-xs text-gray-400">
              I care about your data. Read my{" "}
              <a href="#" className="font-medium text-white hover:underline">
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
