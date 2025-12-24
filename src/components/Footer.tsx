"use client";

import Link from "next/link";
import { Github, Instagram, Mail, Globe } from "lucide-react";

// Static categories by NAME (matches DB category names)
const FOOTER_CATEGORIES = ["Writing", "Learning", "Tech", "Notes", "Career"];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-semibold mb-4">BinaryStories</h3>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Personal writing on technology, learning, and building things — a
              place to think out loud and document the journey.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/GabrielNathanael"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/gabrielnathanaelp/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://gabrielnathanael.site"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="mailto:gabrielnathanael81@gmail.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  All Writing
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Topics (static, filter by name) */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide mb-4">
              Topics
            </h4>
            <ul className="space-y-2 text-sm">
              {FOOTER_CATEGORIES.map((name) => (
                <li key={name}>
                  <Link
                    href={`/articles?category=${encodeURIComponent(name)}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} BinaryStories. Written by Gabriel
          Nathanael.
        </div>
      </div>
    </footer>
  );
}
