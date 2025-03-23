"use client";

import { useSession } from "next-auth/react";
import { Car, User } from "lucide-react";
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
    return (
      <div className="flex items-center justify-center rounded-full overflow-hidden w-8 h-8 focus:outline-none border border-gray-200">
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
      </div>
    );
  }

  // Return just the user icon for non-authenticated users
  return (
    <div className="flex items-center justify-center cursor-pointer">
      <User />
    </div>
  );
}