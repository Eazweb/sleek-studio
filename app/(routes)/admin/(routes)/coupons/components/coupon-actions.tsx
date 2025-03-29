"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Trash, 
  MoreHorizontal, 
  Check, 
  X,
  Edit,
  Eye
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { deleteCoupon, toggleCouponStatus } from "@/actions/coupons";

interface CouponActionsProps {
  couponId: string;
  couponCode: string;
  isActive: boolean;
}

export const CouponActions: React.FC<CouponActionsProps> = ({ 
  couponId, 
  couponCode,
  isActive 
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteCoupon(couponId);
      toast.success("Coupon deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setShowDeleteAlert(false);
    }
  };

  const onToggleStatus = async () => {
    try {
      setLoading(true);
      await toggleCouponStatus(couponId);
      toast.success(`Coupon ${isActive ? 'deactivated' : 'activated'} successfully`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the coupon <span className="font-semibold">{couponCode}</span> and remove it from our servers.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDelete} 
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push(`/admin/coupons/${couponId}`)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/admin/coupons/${couponId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleStatus}>
            {isActive ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteAlert(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}; 