"use server";

import { currentUser } from "@/actions/auth";

interface AuthCheckResult {
  isAuthorized: boolean;
  user: any | null;
  errorMessage?: {
    message: string;
    title: string;
    backUrl?: string;
    backText?: string;
  };
}

/**
 * Check if the current user is an admin and render error message if not
 * Use this in admin-only pages to protect them
 */
export async function requireAdmin(): Promise<AuthCheckResult> {
  const user = await currentUser();
  
  if (!user) {
    return {
      isAuthorized: false,
      user: null,
      errorMessage: {
        message: "You need to be logged in to access this page.",
        title: "Not Authenticated",
        backUrl: "/auth/signin",
        backText: "Go to Sign In"
      }
    };
  }
  
  if (user.role !== "ADMIN") {
    return {
      isAuthorized: false,
      user,
      errorMessage: {
        message: "You don't have permission to access this page. Only admins can view this content.",
        title: "Access Denied"
      }
    };
  }
  
  return {
    isAuthorized: true,
    user,
  };
} 