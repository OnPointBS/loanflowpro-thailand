import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes
const protectedRoutes = [
  "/app",
  "/portal",
  "/workspaces",
];

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/verify",
  "/api",
];

// Define routes that require specific roles
const roleBasedRoutes = {
  "/app": ["advisor", "staff", "partner"],
  "/portal": ["client"],
  "/workspaces": ["advisor", "staff", "client"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get user data from cookies or headers
  // In a real implementation, you'd verify the session token
  const userCookie = request.cookies.get("user");
  const workspaceCookie = request.cookies.get("workspace");
  
  if (!userCookie || !workspaceCookie) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const user = JSON.parse(userCookie.value);
    const workspace = JSON.parse(workspaceCookie.value);

    // Check if user can access the route based on their role
    const requiredRoles = roleBasedRoutes[pathname as keyof typeof roleBasedRoutes];
    
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      // Redirect to appropriate interface based on role
      if (user.role === "client") {
        return NextResponse.redirect(new URL("/portal", request.url));
      } else {
        return NextResponse.redirect(new URL("/app", request.url));
      }
    }

    // Check workspace access
    if (user.workspaceId !== workspace._id) {
      return NextResponse.redirect(new URL("/workspaces", request.url));
    }

    // Check if user is active
    if (user.status !== "active") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Check if workspace is active
    if (workspace.status === "suspended") {
      return NextResponse.redirect(new URL("/suspended", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
