import { Heading } from "@/components/ui/heading";
import { Metadata } from "next";
import { CouponForm } from "../components/coupon-form";

export const metadata: Metadata = {
  title: "New Coupon | Admin Dashboard",
  description: "Create a new discount coupon for your store",
};

const NewCouponPage = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title="Create New Coupon"
          description="Add a new discount coupon to your store"
        />
        
        <CouponForm />
      </div>
    </div>
  );
};

export default NewCouponPage; 