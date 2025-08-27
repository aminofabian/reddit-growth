import NextAuth from "next-auth";
import authConfig from "./auth.config"; // Ensure this path is correct

// Assuming you have defined your routes in a separate file
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  adminRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isAdminRoute = adminRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Allow access to API authentication routes
  if (isApiAuthRoute) {
    return;
  }

  // Redirect authenticated users from auth pages (login, register)
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // Redirect unauthenticated users to the login page
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }
  
  // Handle admin route authorization
  if (isAdminRoute) {
    const isAdmin = req.auth?.user?.role === "ADMIN";
    if (!isAdmin) {
      return Response.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  return;
});

// Matcher to apply middleware to specific routes
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
