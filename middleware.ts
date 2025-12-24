import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // You can add custom logic here if needed
    // For example, check user role
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // User must be logged in to access protected routes
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Protect these routes
export const config = {
  matcher: [
    "/editor/:path*",
    "/dashboard/:path*",
    "/api/dashboard/:path*", // Protect semua endpoint dashboard
  ],
};
