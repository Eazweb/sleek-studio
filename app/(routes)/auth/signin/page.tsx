"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function SignIn() {
  useEffect(() => {
    // Automatically redirect to Google sign-in
    signIn("google", { callbackUrl: "/" });
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Redirecting to Google login...</p>
    </div>
  );
}