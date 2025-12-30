import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin Protection
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }

    // Vendor Protection
    if (path.startsWith("/vendor")) {
      if (token?.role !== "VENDOR") {
         return NextResponse.redirect(new URL("/sell/apply", req.url));
      }
      // Assuming vendorStatus is populated in token via next-auth config
      if (token?.vendorStatus !== "APPROVED") {
         return NextResponse.redirect(new URL("/sell/apply", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = { matcher: ["/admin/:path*", "/vendor/:path*"] }
