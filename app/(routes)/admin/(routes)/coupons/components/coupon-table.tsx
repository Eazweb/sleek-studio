"use client";

import { format } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../../../../../../components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../../../../../components/ui/table";
import { Badge } from "../../../../../../components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CouponActions } from "./coupon-actions";

interface CouponTableProps {
  data: any[];
  pagination: {
    page: number;
    pageSize: number;
    totalCoupons: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onStatusToggle: (id: string) => void;
  isLoading: boolean;
}

export const CouponTable: React.FC<CouponTableProps> = ({
  data,
  pagination,
  onPageChange,
  onStatusToggle,
  isLoading
}) => {
  const { page, pageSize, totalCoupons, totalPages } = pagination;
  
  // Calculate pagination details
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(startIndex + pageSize - 1, totalCoupons);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Min. Order</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No coupons found.
                </TableCell>
              </TableRow>
            )}
            {data.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium">
                  {coupon.code}
                </TableCell>
                <TableCell>
                  <Badge variant={coupon.type === "PERCENTAGE" ? "default" : "secondary"}>
                    {coupon.type === "PERCENTAGE" ? "Percentage" : "Fixed Amount"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {coupon.type === "PERCENTAGE" 
                    ? `${coupon.value}%` 
                    : `₹${coupon.value.toFixed(2)}`}
                </TableCell>
                <TableCell>
                  {coupon.minOrderAmount 
                    ? `₹${coupon.minOrderAmount.toFixed(2)}` 
                    : "-"}
                </TableCell>
                <TableCell>
                  {coupon.validUntil 
                    ? format(new Date(coupon.validUntil), "MMM dd, yyyy")
                    : "No expiration"}
                </TableCell>
                <TableCell>
                  {coupon.maxUsageCount 
                    ? `${coupon.usageCount || 0}/${coupon.maxUsageCount}`
                    : coupon.usageCount || 0}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={coupon.isActive ? "default" : "destructive"}
                    className={coupon.isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                  >
                    {coupon.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <CouponActions 
                    couponId={coupon.id}
                    couponCode={coupon.code}
                    isActive={coupon.isActive}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalCoupons > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex}</span> to{" "}
            <span className="font-medium">{endIndex}</span> of{" "}
            <span className="font-medium">{totalCoupons}</span> coupons
          </div>
          <div className="flex items-center space-x-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isLoading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}; 