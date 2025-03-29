import { Heading } from "@/components/ui/heading";
import { CouponClient } from "./components/client";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { Metadata } from "next";
import { DiscountType, Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Coupons | Admin Dashboard",
  description: "Manage discount coupons for your store",
};

interface CouponsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

// Type definitions for coupon data
interface CouponData {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  isActive: boolean;
  minimumPurchase: number | null;
  maximumDiscount: number | null;
  timesUsed: number;
  maxUsage: number | null;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const CouponsPage = async ({ searchParams }: CouponsPageProps) => {
  // Await searchParams before using its properties
  const params = await searchParams;
  
  // Parse page number from query parameters (default to 1)
  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const pageSize = 10;

  // Calculate pagination offsets
  const skip = (page - 1) * pageSize;

  // Base query conditions
  let where: Prisma.CouponWhereInput = {};
  
  // Add search condition if provided
  if (search) {
    where = {
      OR: [
        { code: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: search, mode: Prisma.QueryMode.insensitive } }
      ],
    };
  }

  // Fetch coupons with pagination
  const coupons = await db.coupon.findMany({
    where,
    orderBy: {
      createdAt: "desc"
    },
    skip,
    take: pageSize,
  });

  // Get total count for pagination
  const totalCoupons = await db.coupon.count({ where });

  // Calculate total pages
  const totalPages = Math.ceil(totalCoupons / pageSize);

  // Format dates and prepare data for client
  const formattedCoupons = coupons.map((coupon: CouponData) => ({
    id: coupon.id,
    code: coupon.code,
    type: coupon.discountType,
    value: coupon.discountValue,
    description: coupon.description || "",
    isActive: coupon.isActive,
    minOrderAmount: coupon.minimumPurchase,
    maxUsageCount: coupon.maxUsage,
    usageCount: coupon.timesUsed,
    validUntil: coupon.endDate,
    createdAt: format(coupon.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title={`Coupons (${totalCoupons})`}
          description="Manage discount coupons for your store"
        />
        
        <CouponClient 
          data={formattedCoupons} 
          pagination={{
            page,
            pageSize,
            totalCoupons,
            totalPages
          }}
        />
      </div>
    </div>
  );
};

export default CouponsPage;
