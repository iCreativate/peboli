import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin Protection - Simplified: Check email instead of role
    if (path.startsWith("/admin") && !path.startsWith("/admin/unauthorized") && !path.startsWith("/admin/debug")) {
        if (!token) {
             const url = new URL("/login", req.url);
             url.searchParams.set("callbackUrl", path);
             return NextResponse.redirect(url);
        }
        // Simplified: Check if email is admin@peboli.store
        const userEmail = (token as any).email || (token as any).name;
        if (!userEmail || userEmail !== 'admin@peboli.store') {
             // Redirect non-admins to unauthorized page
             return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
        }
    }

    // Vendor Protection
    if (path.startsWith("/vendor")) {
      if (!token) {
             const url = new URL("/login", req.url);
             url.searchParams.set("callbackUrl", path);
             return NextResponse.redirect(url);
      }
      if (token.role !== "VENDOR") {
         return NextResponse.redirect(new URL("/sell/apply", req.url));
      }
      // Assuming vendorStatus is populated in token via next-auth config
      if (token.vendorStatus !== "APPROVED") {
         return NextResponse.redirect(new URL("/sell/apply", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
          // If we return true here, the middleware function above runs.
          // If we return false, it redirects to sign-in page automatically.
          // We want to run middleware logic to handle roles, so we let logged-in users pass.
          // BUT, we also want to intercept unauthenticated users in the middleware function
          // OR let the 'authorized' callback handle the basic "is logged in" check.
          
          // Let's rely on the middleware function for granular control, 
          // so we return true to always run middleware (or at least for public pages?)
          // No, 'authorized' only runs on matched paths.
          
          // If we return !!token, then unauthenticated users are blocked BEFORE middleware function runs.
          // They are sent to the default sign-in page.
          // The user says "not requiring any login".
          // This implies that perhaps 'authorized' is returning true incorrectly?
          // Or the matcher is missing.
          
          return true; // Let the middleware function handle the redirection logic
      },
    },
  }
)

export const config = { matcher: ["/admin/:path*", "/vendor/:path*"] }
