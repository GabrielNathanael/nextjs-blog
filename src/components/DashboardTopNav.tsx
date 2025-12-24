"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User, Menu } from "lucide-react";
import { useSidebar } from "@/app/context/SidebarContext";

export default function DashboardTopNav() {
  const { data: session } = useSession();
  const { setIsMobileOpen } = useSidebar();

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 h-14 flex items-center">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 text-gray-600"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-sm font-medium text-gray-900">Dashboard</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-gray-700 px-3 py-1.5 rounded-md bg-gray-50">
            <User size={16} />
            <span className="text-sm">{session?.user?.name || "User"}</span>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
