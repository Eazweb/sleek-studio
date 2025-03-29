import { Heading } from "@/components/ui/heading";
import { CouponForm } from "../../components/coupon-form";
import { getCouponById } from "@/actions/coupons";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Edit Coupon | Admin Dashboard",
  description: "Update coupon settings",
};

// Use the Next.js 15 pattern for dynamic page params
type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const EditCouponPage = async ({ params }: PageProps) => {
  // Await params before using them
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  // Fetch coupon data
  let coupon;
  try {
    coupon = await getCouponById(id);
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return notFound();
  }

  // If no coupon found, show 404
  if (!coupon) {
    return notFound();
  }

  // Format data for the form
  const formattedCoupon = {
    ...coupon,
    startDate: coupon.startDate,
    endDate: coupon.endDate || undefined,
    // Ensure numeric values are properly parsed
    discountValue: parseFloat(coupon.discountValue.toString()),
    minimumPurchase: coupon.minimumPurchase ? parseFloat(coupon.minimumPurchase.toString()) : undefined,
    maximumDiscount: coupon.maximumDiscount ? parseFloat(coupon.maximumDiscount.toString()) : undefined,
    maxUsage: coupon.maxUsage || undefined,
    maxUsagePerUser: coupon.maxUsagePerUser || undefined,
    productCategories: coupon.productCategories || [],
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title={`Edit Coupon: ${coupon.code}`}
            description="Update coupon details and settings"
          />
          <Button variant="outline" asChild>
            <Link href={`/admin/coupons/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Details
            </Link>
          </Button>
        </div>
        
        <CouponForm initialData={formattedCoupon} />
      </div>
    </div>
  );
};

export default EditCouponPage; 