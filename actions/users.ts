"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

/**
 * Get current user helper
 */
async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

/**
 * Get a user by ID
 */
export async function getUserById(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        addresses: true,
        orders: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}

/**
 * Get current user's profile
 */
export async function getCurrentUserProfile() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return null;
    }

    const userProfile = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        addresses: true,
      },
    });

    return userProfile;
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    throw new Error("Failed to fetch profile");
  }
}

/**
 * Add a product to user's wishlist
 */
export async function addToWishlist(productId: string) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("Not authenticated");
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        wishlistIds: {
          push: productId,
        },
      },
    });

    revalidatePath("/profile/wishlist");
    return { success: true };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw new Error("Failed to add to wishlist");
  }
}

/**
 * Remove a product from user's wishlist
 */
export async function removeFromWishlist(productId: string) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Get current wishlist
    const userWithWishlist = await db.user.findUnique({
      where: { id: user.id },
      select: { wishlistIds: true },
    });

    if (!userWithWishlist) {
      throw new Error("User not found");
    }

    // Filter out the product ID
    const updatedWishlist = userWithWishlist.wishlistIds.filter((id: string) => id !== productId);

    // Update the user
    await db.user.update({
      where: { id: user.id },
      data: {
        wishlistIds: updatedWishlist,
      },
    });

    revalidatePath("/profile/wishlist");
    return { success: true };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw new Error("Failed to remove from wishlist");
  }
}

/**
 * Get user's wishlist
 */
export async function getUserWishlist() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return [];
    }

    const userWithWishlist = await db.user.findUnique({
      where: { id: user.id },
      select: {
        wishlist: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            salePrice: true,
            images: true,
            category: true,
          },
        },
      },
    });

    return userWithWishlist?.wishlist || [];
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw new Error("Failed to fetch wishlist");
  }
} 