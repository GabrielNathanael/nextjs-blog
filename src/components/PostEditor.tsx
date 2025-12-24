"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import TipTapEditor from "@/components/TipTapEditor";
import PostPreviewModal from "./PostPreviewModal";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
}

interface PostEditorProps {
  postId?: string;
}

export default function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!postId);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    shortDesc: "",
    thumbnail: "",
    content: "",
    published: false,
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/dashboard/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err: unknown) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/dashboard/posts/${postId}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();

        setFormData({
          title: data.title,
          categoryId: data.categoryId.toString(),
          shortDesc: data.shortDesc,
          thumbnail: data.thumbnail,
          content: data.content,
          published: data.published,
        });
        setThumbnailPreview(data.thumbnail);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoadingData(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const uploadThumbnail = async (): Promise<string | null> => {
    if (!thumbnailFile) return formData.thumbnail || null;

    setUploadingThumbnail(true);
    try {
      const formData = new FormData();
      formData.append("file", thumbnailFile);
      formData.append("folder", "thumbnails");

      const res = await fetch("/api/dashboard/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload thumbnail");

      const data = await res.json();
      return data.url;
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred");
      }
      return null;
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (
      !formData.title ||
      !formData.categoryId ||
      !formData.shortDesc ||
      !formData.content
    ) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (formData.shortDesc.length > 120) {
      setError("Short description must be 120 characters or less");
      setLoading(false);
      return;
    }

    if (!formData.thumbnail && !thumbnailFile) {
      setError("Thumbnail is required");
      setLoading(false);
      return;
    }

    try {
      // Upload thumbnail if new file selected
      const thumbnailUrl = await uploadThumbnail();
      if (!thumbnailUrl) {
        throw new Error("Failed to upload thumbnail");
      }

      const postData = {
        ...formData,
        thumbnail: thumbnailUrl,
        categoryId: parseInt(formData.categoryId),
      };

      const url = postId
        ? `/api/dashboard/posts/${postId}`
        : "/api/dashboard/posts";
      const method = postId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save post");
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {postId ? "Edit Post" : "Create New Post"}
          </h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter post title"
            disabled={loading}
          />
        </div>

        {/* Category & Short Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description * ({formData.shortDesc.length}/120)
            </label>
            <input
              type="text"
              value={formData.shortDesc}
              onChange={(e) =>
                setFormData({ ...formData, shortDesc: e.target.value })
              }
              maxLength={120}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description"
              disabled={loading}
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail *
          </label>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer"
              disabled={loading}
            />
            {thumbnailPreview && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                <Image
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <TipTapEditor
            content={formData.content}
            onChange={(html) => setFormData({ ...formData, content: html })}
          />
        </div>

        {/* Published Toggle */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) =>
                setFormData({ ...formData, published: e.target.checked })
              }
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={loading}
            />
            <span className="text-sm font-medium text-gray-700">
              Publish immediately
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-6 py-2 bg-gray-100 text-gray-700 border border-transparent rounded-lg hover:bg-gray-200 transition-colors"
          >
            Preview
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || uploadingThumbnail}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {loading
              ? "Saving..."
              : uploadingThumbnail
              ? "Uploading..."
              : postId
              ? "Update Post"
              : "Create Post"}
          </button>
        </div>
      </form>

      <PostPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={{
          title: formData.title,
          content: formData.content,
          thumbnail: thumbnailPreview || formData.thumbnail,
          category:
            categories.find((c) => c.id.toString() === formData.categoryId)
              ?.name || "",
          author: session?.user?.name || "Anonymous",
          createdAt: new Date().toISOString(),
        }}
      />
    </div>
  );
}
