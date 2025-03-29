import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// GET handler for coupons list with filtering & pagination
export async function GET(request: Request) {
  try {
    // Verify admin access
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
    const isActive = searchParams.has("isActive") 
      ? searchParams.get("isActive") === "true" 
      : undefined;

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

    return NextResponse.json({
      coupons,
      pagination: {
        page,
        pageSize,
        totalCoupons,
        totalPages: Math.ceil(totalCoupons / pageSize),
      }
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST handler for creating a new coupon
export async function POST(request: Request) {
  try {
    // Verify admin access
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.code || !body.name || body.discountValue === undefined || !body.discountType) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if coupon code already exists
    const existingCoupon = await db.coupon.findUnique({
      where: { code: body.code },
    });

    if (existingCoupon) {
      return new NextResponse("Coupon code already exists", { status: 409 });
    }

    // Process and validate the data
    const couponData = {
      ...body,
      discountValue: Number(body.discountValue),
      minimumPurchase: body.minimumPurchase ? Number(body.minimumPurchase) : null,
      maximumDiscount: body.maximumDiscount ? Number(body.maximumDiscount) : null,
      maxUsage: body.maxUsage ? Number(body.maxUsage) : null,
      maxUsagePerUser: body.maxUsagePerUser ? Number(body.maxUsagePerUser) : null,
      createdByUserId: session.user.id,
      applicableUserIds: body.applicableUserIds || [],
      excludedUserIds: body.excludedUserIds || [],
      excludedProducts: body.excludedProducts || [],
      productCategories: body.productCategories || [],
    };

    // Create the coupon
    const coupon = await db.coupon.create({
      data: couponData,
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return new NextResponse(`Failed to create coupon: ${error instanceof Error ? error.message : "Unknown error"}`, { status: 500 });
  }
} 