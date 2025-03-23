"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import bcrypt from "bcrypt";

/**
 * Get the current logged-in user
 */
export async function currentUser() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }
  
  return session.user;
}

/**
 * Check if current user is admin
 */
export async function isAdmin() {
  const user = await currentUser();
  return user?.role === "ADMIN";
}

/**
 * Update user profile
 */
export async function updateProfile(name: string) {
  try {
    const user = await currentUser();
    
    if (!user) {
      throw new Error("Not authenticated");
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { name },
      select: {
        id: true,
        name: true,
      },
    });
    
    return updatedUser;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }
}

/**
 * Update user password
 */
export async function updatePassword(currentPassword: string, newPassword: string) {
  try {
    const user = await currentUser();
    
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Get user with password
    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        hashedPassword: true,
      },
    });

    if (!dbUser || !dbUser.hashedPassword) {
      throw new Error("User not found or no password set");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      dbUser.hashedPassword
    );

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await db.user.update({
      where: { id: user.id },
      data: { hashedPassword },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error updating password:", error);
    throw new Error(error.message || "Failed to update password");
  }
} 