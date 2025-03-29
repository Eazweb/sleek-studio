"use client";

import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";

/**
 * Client component that wraps the app with the NextAuth SessionProvider
 */
export function AuthProvider({ children }: PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
} 