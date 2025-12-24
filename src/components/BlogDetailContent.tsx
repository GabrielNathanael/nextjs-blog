"use client";

import Image from "next/image";
import { Facebook, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface BlogDetailContentProps {
  post: {
    title: string;
    author: string;
    createdAt: string;
    thumbnail: string;
    content: string;
    category: string;
    slug: string;
  };
}

export default function BlogDetailContent({ post }: BlogDetailContentProps) {
  const [copied, setCopied] = useState(false);

  const [shareUrl, setShareUrl] = useState(
    `https://binarystories.com/articles/${post.slug}`
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(post.title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`,
  };

  const readingTime = Math.ceil(post.content.split(" ").length / 200);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <header className="mb-8">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-gray-900 text-white text-xs font-semibold rounded-full">
            {post.category}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author Info & Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <span className="font-medium text-gray-900">{post.author}</span>
          <span>•</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>

        {/* Share Buttons */}
        <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
          <span className="text-sm text-gray-600 font-medium">Share:</span>
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Share on Facebook"
          >
            <Facebook size={18} className="text-gray-700" />
          </a>
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Share on Twitter"
          >
            <Twitter size={18} className="text-gray-700" />
          </a>
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Share on LinkedIn"
          >
            <Linkedin size={18} className="text-gray-700" />
          </a>
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            aria-label="Copy link"
          >
            <LinkIcon size={18} className="text-gray-700" />
            {copied && (
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Featured Image */}
      <div className="w-full mb-8 rounded-lg overflow-hidden shadow-lg">
        <Image
          src={post.thumbnail}
          alt={post.title}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          className="max-h-[400px] object-cover"
          priority
          loading="eager"
        />
      </div>

      {/* Article Content */}
      <div
        className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-img:rounded-lg [&_img]:!mx-auto [&_img]:!block [&_img]:!my-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Bottom Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Written by</p>
            <p className="font-semibold text-gray-900">{post.author}</p>
          </div>

          {/* Share Buttons (Bottom) */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Share:</span>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Facebook size={18} className="text-gray-700" />
            </a>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Twitter size={18} className="text-gray-700" />
            </a>
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Linkedin size={18} className="text-gray-700" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
