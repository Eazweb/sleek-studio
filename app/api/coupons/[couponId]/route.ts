import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

// GET handler for a specific coupon
export async function GET(
  request: Request,
  { params }: { params: Promise<{ couponId: string }> }
) {
  try {
    // Verify admin access
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Await params before using them
    const resolvedParams = await params;
    const { couponId } = resolvedParams;

    if (!couponId) {
      return new NextResponse("Coupon ID is required", { status: 400 });
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
      return new NextResponse("Coupon not found", { status: 404 });
    }

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// PATCH handler to update a coupon
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ couponId: string }> }
) {
  try {
    // Verify admin access
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Await params before using them
    const resolvedParams = await params;
    const { couponId } = resolvedParams;
    const body = await request.json();

    if (!couponId) {
      return new NextResponse("Coupon ID is required", { status: 400 });
    }

    // Check if coupon exists
    const existingCoupon = await db.coupon.findUnique({
      where: { id: couponId },
    });

    if (!existingCoupon) {
      return new NextResponse("Coupon not found", { status: 404 });
    }

    // Process the update data
    const updateData = {
      ...body,
      discountValue: body.discountValue !== undefined 
        ? Number(body.discountValue) 
        : undefined,
      minimumPurchase: body.minimumPurchase !== undefined 
        ? (body.minimumPurchase ? Number(body.minimumPurchase) : null) 
        : undefined,
      maximumDiscount: body.maximumDiscount !== undefined 
        ? (body.maximumDiscount ? Number(body.maximumDiscount) : null) 
        : undefined,
      maxUsage: body.maxUsage !== undefined 
        ? (body.maxUsage ? Number(body.maxUsage) : null) 
        : undefined,
      maxUsagePerUser: body.maxUsagePerUser !== undefined 
        ? (body.maxUsagePerUser ? Number(body.maxUsagePerUser) : null) 
        : undefined,
    };

    // Update the coupon
    const updatedCoupon = await db.coupon.update({
      where: { id: couponId },
      data: updateData,
    });

    return NextResponse.json(updatedCoupon);
  } catch (error) {
    console.error("Error updating coupon:", error);
    return new NextResponse(`Failed to update coupon: ${error instanceof Error ? error.message : "Unknown error"}`, { status: 500 });
  }
}

// DELETE handler to delete a coupon
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ couponId: string }> }
) {
  try {
    // Verify admin access
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Await params before using them
    const resolvedParams = await params;
    const { couponId } = resolvedParams;

    if (!couponId) {
      return new NextResponse("Coupon ID is required", { status: 400 });
    }

    // Check if coupon exists
    const existingCoupon = await db.coupon.findUnique({
      where: { id: couponId },
    });

    if (!existingCoupon) {
      return new NextResponse("Coupon not found", { status: 404 });
    }

    // First delete related coupon usages
    await db.couponUsage.deleteMany({
      where: { couponId },
    });

    // Delete the coupon
    await db.coupon.delete({
      where: { id: couponId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 