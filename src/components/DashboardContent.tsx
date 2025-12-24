"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Mail,
  Send,
} from "lucide-react";
import Image from "next/image";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";

import Modal from "@/components/Modal";
import PostPreviewModal from "@/components/PostPreviewModal";

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  published: boolean;
  createdAt: string;
  shortDesc: string;
  category: {
    id: number;
    name: string;
  };
  author: {
    id: number;
    name: string;
  };
}

const columnHelper = createColumnHelper<Post>();

export default function DashboardContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Preview State
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Newsletter State
  const [newsletterPost, setNewsletterPost] = useState<Post | null>(null);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [sendingNewsletter, setSendingNewsletter] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/dashboard/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/dashboard/posts/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete post");

      setPosts((prev) => prev.filter((post) => post.id !== deleteId));
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred");
      }
    } finally {
      setDeleteId(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handlePreview = (post: Post) => {
    setPreviewPost(post);
    setIsPreviewOpen(true);
  };

  const openNewsletterModal = (post: Post) => {
    setNewsletterPost(post);
    setIsNewsletterModalOpen(true);
  };

  const confirmSendNewsletter = async () => {
    if (!newsletterPost) return;

    setSendingNewsletter(true);

    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: newsletterPost.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send newsletter");
      }

      alert(`✅ Newsletter sent to ${data.sentTo} subscribers!`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`❌ ${err.message}`);
      } else {
        alert("An unknown error occurred");
      }
    } finally {
      setSendingNewsletter(false);
      setIsNewsletterModalOpen(false);
      setNewsletterPost(null);
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Post",
        cell: (info) => {
          const post = info.row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex-shrink-0 relative rounded overflow-hidden bg-gray-100">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {post.title}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  by {post.author.name}
                </div>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("category.name", {
        header: "Category",
        cell: (info) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("published", {
        header: "Status",
        cell: (info) => {
          const published = info.getValue();
          return (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                published
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {published ? (
                <>
                  <Eye size={12} />
                  Published
                </>
              ) : (
                <>
                  <EyeOff size={12} />
                  Draft
                </>
              )}
            </span>
          );
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "Date",
        cell: (info) => (
          <span className="text-sm text-gray-600">
            {new Date(info.getValue()).toLocaleDateString()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: (info) => {
          const post = info.row.original;
          return (
            <div className="flex items-center justify-end gap-1">
              <button
                onClick={() => handlePreview(post)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                title="Preview Post"
              >
                <Eye size={16} />
              </button>
              <Link
                href={`/dashboard/editor/${post.id}`}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                title="Edit Post"
              >
                <Edit size={16} />
              </Link>
              {post.published && (
                <button
                  onClick={() => openNewsletterModal(post)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Send Newsletter"
                >
                  <Send size={16} />
                </button>
              )}
              <button
                onClick={() => openDeleteModal(post.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete Post"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: posts,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-gray-500">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Posts</h1>
          <p className="text-sm text-gray-600 mt-0.5">Manage your blog posts</p>
        </div>
        <Link
          href="/dashboard/editor"
          className="flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-sm text-gray-500 mb-4">No posts yet</p>
          <Link
            href="/dashboard/editor"
            className="inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} />
            Create Your First Post
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search posts..."
              className="w-full max-w-sm text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? "cursor-pointer select-none flex items-center gap-1 hover:text-gray-900"
                                : ""
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <span className="text-gray-400">
                                {header.column.getIsSorted() === "asc" ? (
                                  <ChevronUp size={14} />
                                ) : header.column.getIsSorted() === "desc" ? (
                                  <ChevronDown size={14} />
                                ) : (
                                  <ChevronDown
                                    size={14}
                                    className="opacity-30"
                                  />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-600">
              Showing{" "}
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{" "}
              to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                posts.length
              )}{" "}
              of {posts.length} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Post"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Newsletter Confirmation Modal */}
      <Modal
        isOpen={isNewsletterModalOpen}
        onClose={() => !sendingNewsletter && setIsNewsletterModalOpen(false)}
        title="Send Newsletter"
      >
        <div className="space-y-4">
          {newsletterPost && (
            <>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="h-16 w-16 flex-shrink-0 relative rounded overflow-hidden">
                  <Image
                    src={newsletterPost.thumbnail}
                    alt={newsletterPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {newsletterPost.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {newsletterPost.category.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                <Mail size={16} />
                <span>
                  This will send an email newsletter to all subscribers
                </span>
              </div>

              <p className="text-sm text-gray-600">
                Are you sure you want to send this post as a newsletter to all
                subscribers?
              </p>
            </>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsNewsletterModalOpen(false)}
              disabled={sendingNewsletter}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={confirmSendNewsletter}
              disabled={sendingNewsletter}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sendingNewsletter ? (
                <>
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
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Newsletter
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      {previewPost && (
        <PostPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setPreviewPost(null);
          }}
          data={{
            title: previewPost.title,
            content: previewPost.content,
            thumbnail: previewPost.thumbnail,
            category: previewPost.category.name,
            author: previewPost.author.name,
            createdAt: previewPost.createdAt,
            slug: previewPost.slug,
          }}
        />
      )}
    </div>
  );
}
