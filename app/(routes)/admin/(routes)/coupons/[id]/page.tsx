import { Heading } from "@/components/ui/heading";
import { getCouponById } from "@/actions/coupons";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Coupon Details | Admin Dashboard",
  description: "View and edit coupon details",
};

// Use the Next.js 15 pattern for dynamic page params
type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const CouponDetailPage = async ({ params }: PageProps) => {
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

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title={`Coupon: ${coupon.code}`}
            description="View coupon details"
          />
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/coupons">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Coupons
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/admin/coupons/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Coupon
              </Link>
            </Button>
          </div>
        </div>

        <div className="border p-4 rounded-md bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="mt-3 space-y-2">
                <p><span className="font-medium">Code:</span> {coupon.code}</p>
                <p><span className="font-medium">Name:</span> {coupon.name}</p>
                <p><span className="font-medium">Description:</span> {coupon.description || "N/A"}</p>
                <p>
                  <span className="font-medium">Discount:</span> 
                  {coupon.discountType === "PERCENTAGE" 
                    ? `${coupon.discountValue}%` 
                    : `₹${coupon.discountValue.toFixed(2)}`}
                </p>
                <p>
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${coupon.isActive 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"}`}>
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">Usage Details</h3>
              <div className="mt-3 space-y-2">
                <p><span className="font-medium">Valid From:</span> {format(new Date(coupon.startDate), "MMM dd, yyyy")}</p>
                <p>
                  <span className="font-medium">Valid Until:</span> 
                  {coupon.endDate ? format(new Date(coupon.endDate), "MMM dd, yyyy") : "No expiration"}
                </p>
                <p><span className="font-medium">Times Used:</span> {coupon.timesUsed}</p>
                <p>
                  <span className="font-medium">Usage Limit:</span> 
                  {coupon.maxUsage ? coupon.maxUsage : "Unlimited"}
                </p>
                <p>
                  <span className="font-medium">Min. Purchase:</span> 
                  {coupon.minimumPurchase ? `₹${coupon.minimumPurchase.toFixed(2)}` : "None"}
                </p>
                <p>
                  <span className="font-medium">Max. Discount:</span> 
                  {coupon.maximumDiscount ? `₹${coupon.maximumDiscount.toFixed(2)}` : "None"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium">Recent Orders</h3>
            {coupon.orders.length > 0 ? (
              <div className="mt-3 border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coupon.orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(order.createdAt), "MMM dd, yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.user.name || order.user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{order.discountAmount?.toFixed(2) || "0.00"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-3 text-gray-500">No orders have used this coupon yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponDetailPage; 