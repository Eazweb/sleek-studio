import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getServerSession } from "next-auth";

// Main auth functions
export const { signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});

// For use in server components
export const auth = async () => {
  return await getServerSession(authConfig);
}; 