"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateUserRole } from "@/actions/users";

interface UserRoleToggleProps {
  userId: string;
  currentRole: string;
}

export function UserRoleToggle({ userId, currentRole }: UserRoleToggleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleRole = async () => {
    try {
      setIsLoading(true);
      const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
      
      // Use server action directly
      await updateUserRole(userId, newRole as "ADMIN" | "USER");
      
      toast.success(`User role updated to ${newRole}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error(`Failed to update user role: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <span className="font-medium">Current Role:</span>
        <span className={`px-2 py-1 rounded-full text-sm ${
          currentRole === "ADMIN" 
            ? "bg-purple-100 text-purple-800" 
            : "bg-gray-100 text-gray-800"
        }`}>
          {currentRole}
        </span>
      </div>
      <Button
        variant="outline"
        onClick={toggleRole}
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : `Make ${currentRole === "ADMIN" ? "User" : "Admin"}`}
      </Button>
    </div>
  );
} 