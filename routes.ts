// An array of public routes
// These routes don't require authentication
// @type {string[]}

export const publicRoutes = [
  "/auth/new-verification",
  "/dashboard",
  "/auth/verify-email",
  "/auth/new-password",
  "/auth/reset",
  "/auth/new-verification",
  "/auth/new-password",
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password"
];

/*
  This is an array of routes that are used for authentication
  The routes will redirect logged in users to '/'
  @types {string[]}
  */

export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password"
];


export const adminRoutes = [
  "/reddit-analytics",
  // Add other admin routes here
];


// The prefix for the api routes
//Routes that start with this prefix are used for API authentication and authorization
// @type {string}

export const apiAuthPrefix = "/api/auth";

/* 
  This is the default redirect path after the user has logged in
  @type {string}
  */
export const DEFAULT_LOGIN_REDIRECT = "/";
