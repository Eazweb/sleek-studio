"use server";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Prisma, DiscountType } from "@prisma/client";

// Define types for coupon operations
export type CouponFormData = {
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minimumPurchase?: number;
  maximumDiscount?: number;
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  maxUsage?: number;
  maxUsagePerUser?: number;
  productCategories: string[];
  isSingleUse: boolean;
  isFirstTimeOnly: boolean;
};

export type FetchCouponsParams = {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
};

/**
 * Get all coupons with pagination, filtering, and sorting
 */
export async function fetchCoupons({
  page = 1,
  pageSize = 10,
  search = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
  isActive
}: FetchCouponsParams) {
  try {
    // Verify admin access
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Build where clause for search and filters
    let where: Prisma.CouponWhereInput = {};

    // Add search condition if provided
    if (search) {
      where = {
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { code: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: search, mode: Prisma.QueryMode.insensitive } }
        ],
      };
    }

    // Add isActive filter if provided
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Fetch coupons
    const [coupons, totalCoupons] = await Promise.all([
      db.coupon.findMany({
        where,
        select: {
          id: true,
          code: true,
          name: true,
          discountType: true,
          discountValue: true,
          isActive: true,
          timesUsed: true,
          startDate: true,
          endDate: true,
          createdAt: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: pageSize,
      }),
      db.coupon.count({ where })
    ]);

    return {
      coupons,
      pagination: {
        page,
        pageSize,
        totalCoupons,
        totalPages: Math.ceil(totalCoupons / pageSize),
      }
    };
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw new Error('Failed to fetch coupons');
  }
}

/**
 * Get a single coupon by ID
 */
export async function getCouponById(couponId: string) {
  try {
    // Verify admin access
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    const coupon = await db.coupon.findUnique({
      where: { id: couponId },
      include: {
        orders: {
          select: {
            id: true,
            createdAt: true,
            total: true,
            discountAmount: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!coupon) {
      throw new Error('Coupon not found');
    }

    return coupon;
  } catch (error) {
    console.error('Error fetching coupon:', error);
    throw new Error('Failed to fetch coupon');
  }
}

/**
 * Create a new coupon
 */
export async function createCoupon(data: CouponFormData) {
  try {
    // Verify admin access
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    // Check if coupon code already exists
    const existingCoupon = await db.coupon.findUnique({
      where: { code: data.code },
    });

    if (existingCoupon) {
      throw new Error('Coupon code already exists');
    }

    // Format and validate the data
    const couponData = {
      ...data,
      discountValue: Number(data.discountValue),
      minimumPurchase: data.minimumPurchase ? Number(data.minimumPurchase) : null,
      maximumDiscount: data.maximumDiscount ? Number(data.maximumDiscount) : null,
      maxUsage: data.maxUsage ? Number(data.maxUsage) : null,
      maxUsagePerUser: data.maxUsagePerUser ? Number(data.maxUsagePerUser) : null,
      createdByUserId: session.user.id,
      applicableUserIds: [],
      excludedUserIds: [],
      excludedProducts: [],
    };

    // Create the coupon
    const coupon = await db.coupon.create({
      data: couponData,
    });

    // Revalidate the coupons list
    revalidatePath('/admin/coupons');

    return { success: true, coupon };
  } catch (error) {
    console.error('Error creating coupon:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create coupon');
  }
}

/**
 * Update an existing coupon
 */
export async function updateCoupon(couponId: string, data: CouponFormData) {
  try {
    // Verify admin access
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    // Check if coupon exists
    const existingCoupon = await db.coupon.findUnique({
      where: { id: couponId },
    });

    if (!existingCoupon) {
      throw new Error('Coupon not found');
    }

    // Format and validate the data
    const couponData = {
      ...data,
      discountValue: Number(data.discountValue),
      minimumPurchase: data.minimumPurchase ? Number(data.minimumPurchase) : null,
      maximumDiscount: data.maximumDiscount ? Number(data.maximumDiscount) : null,
      maxUsage: data.maxUsage ? Number(data.maxUsage) : null,
      maxUsagePerUser: data.maxUsagePerUser ? Number(data.maxUsagePerUser) : null,
    };

    // Update the coupon
    const coupon = await db.coupon.update({
      where: { id: couponId },
      data: couponData,
    });

    // Revalidate the coupons list and detail page
    revalidatePath('/admin/coupons');
    revalidatePath(`/admin/coupons/${couponId}`);

    return { success: true, coupon };
  } catch (error) {
    console.error('Error updating coupon:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update coupon');
  }
}

/**
 * Delete a coupon
 */
export async function deleteCoupon(couponId: string) {
  try {
    // Verify admin access
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    // Check if coupon exists
    const existingCoupon = await db.coupon.findUnique({
      where: { id: couponId },
    });

    if (!existingCoupon) {
      throw new Error('Coupon not found');
    }

    // First delete related coupon usages
    await db.couponUsage.deleteMany({
      where: { couponId },
    });

    // Delete the coupon
    await db.coupon.delete({
      where: { id: couponId },
    });

    // Revalidate the coupons list
    revalidatePath('/admin/coupons');

    return { success: true };
  } catch (error) {
    console.error('Error deleting coupon:', error);
    throw new Error('Failed to delete coupon');
  }
}

/**
 * Toggle a coupon's active status
 */
export async function toggleCouponStatus(couponId: string) {
  try {
    // Verify admin access
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    // Get current coupon status
    const coupon = await db.coupon.findUnique({
      where: { id: couponId },
      select: { isActive: true },
    });

    if (!coupon) {
      throw new Error('Coupon not found');
    }

    // Toggle the status
    const updatedCoupon = await db.coupon.update({
      where: { id: couponId },
      data: { isActive: !coupon.isActive },
    });

    // Revalidate paths
    revalidatePath('/admin/coupons');
    revalidatePath(`/admin/coupons/${couponId}`);

    return { success: true, isActive: updatedCoupon.isActive };
  } catch (error) {
    console.error('Error toggling coupon status:', error);
    throw new Error('Failed to update coupon status');
  }
} 