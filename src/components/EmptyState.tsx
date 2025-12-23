import { FileQuestion, RefreshCcw } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export default function EmptyState({
  title = "No posts found",
  message = "I couldn't find what you're looking for. Please check back later or try a different filter.",
  actionLabel,
  onAction,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <FileQuestion size={40} className="text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-8">{message}</p>

      {actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-gray-200"
        >
          {actionLabel || "Go Back Home"}
        </Link>
      ) : onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-gray-200"
        >
          <RefreshCcw size={18} />
          {actionLabel || "Reset Filters"}
        </button>
      ) : null}
    </div>
  );
}
