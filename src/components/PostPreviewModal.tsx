"use client";

import Image from "next/image";
import { Facebook, Twitter, Linkedin, Link as LinkIcon, X } from "lucide-react";

interface PreviewData {
  title: string;
  author: string;
  createdAt: string; // or Date
  thumbnail: string;
  content: string;
  category: string;
  slug?: string; // Optional in preview
}

interface PostPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PreviewData;
}

export default function PostPreviewModal({
  isOpen,
  onClose,
  data,
}: PostPreviewModalProps) {
  // Mock reading time calculation
  const readingTime = Math.ceil((data.content?.split(" ").length || 0) / 200);

  if (!isOpen) return null;

  return (
    // We use a custom full-screen overlay instead of the generic small Modal
    // so it looks exactly like the real page.
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-in fade-in duration-200">
      {/* Top Bar for Closing */}
      <div className="sticky top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-2 text-gray-500">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm font-medium">Preview Mode</span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
        >
          <X size={18} />
          Close Preview
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 bg-white">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-gray-900 text-white text-xs font-semibold rounded-full">
              {data.category || "Uncategorized"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {data.title || "Untitled Post"}
          </h1>

          {/* Author Info & Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span className="font-medium text-gray-900">{data.author}</span>
            <span>•</span>
            <span>
              {new Date().toLocaleDateString("en-US", {
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
            <button
              disabled
              className="p-2 rounded-full hover:bg-gray-100 transition-colors opacity-50 cursor-not-allowed"
            >
              <Facebook size={18} className="text-gray-700" />
            </button>
            <button
              disabled
              className="p-2 rounded-full hover:bg-gray-100 transition-colors opacity-50 cursor-not-allowed"
            >
              <Twitter size={18} className="text-gray-700" />
            </button>
            <button
              disabled
              className="p-2 rounded-full hover:bg-gray-100 transition-colors opacity-50 cursor-not-allowed"
            >
              <Linkedin size={18} className="text-gray-700" />
            </button>
            <button
              disabled
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative opacity-50 cursor-not-allowed"
            >
              <LinkIcon size={18} className="text-gray-700" />
            </button>
          </div>
        </header>

        {/* Featured Image */}
        {data.thumbnail ? (
          <div className="w-full mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={data.thumbnail}
              alt={data.title}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
              className="max-h-[400px] object-cover"
              priority
            />
          </div>
        ) : (
          <div className="w-full h-[300px] mb-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            No thumbnail uploaded
          </div>
        )}

        {/* Article Content */}
        {data.content ? (
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-img:rounded-lg [&_img]:!mx-auto [&_img]:!block [&_img]:!my-8"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        ) : (
          <div className="py-12 text-center text-gray-400 italic">
            Start writing content to see preview...
          </div>
        )}

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Written by</p>
              <p className="font-semibold text-gray-900">{data.author}</p>
            </div>

            {/* Share Buttons (Bottom) */}
            <div className="flex items-center gap-2 opacity-50">
              <span className="text-sm text-gray-600 font-medium">Share:</span>
              <div className="p-2 rounded-full bg-gray-50">
                <Facebook size={18} className="text-gray-700" />
              </div>
              <div className="p-2 rounded-full bg-gray-50">
                <Twitter size={18} className="text-gray-700" />
              </div>
              <div className="p-2 rounded-full bg-gray-50">
                <Linkedin size={18} className="text-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
