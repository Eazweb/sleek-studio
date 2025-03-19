"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reset image error state when session changes
    setImageError(false);
  }, [session]);

  if (isLoading) {
    return <Skeleton className="w-8 h-8 rounded-full" />;
  }

  if (session && session.user) {
    // Debug to console to verify what's coming through
    console.log("Session user:", session.user);
    
    return (
      <button
        onClick={() => signOut()}
        className="flex items-center justify-center rounded-full overflow-hidden w-8 h-8 focus:outline-none border border-gray-200"
        title="Sign Out"
      >
        {session.user.image && !imageError ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User avatar"}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white">
            {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="flex items-center justify-center rounded-full p-1 w-8 h-8 bg-gray-200 hover:bg-gray-300 focus:outline-none"
      title="Sign In with Google"
    >
      <User size={20} className="text-gray-700" />
    </button>
  );
}