import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Helper function to get the auth session on the server
 * Use this in server components or server actions
 */
export async function getAuthSession() {
  try {
    return await getServerSession(authConfig);
  } catch (error) {
    console.error("Error getting auth session:", error);
    return null;
  }
} 