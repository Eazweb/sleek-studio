/**
 * This is a compatibility file for older imports
 * It re-exports the auth functionality from the lib directory
 */

export { getAuthSession } from "@/lib/auth";
export { signIn, signOut } from "next-auth/react"; 