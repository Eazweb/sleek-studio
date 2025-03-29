"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreHorizontal, PowerOff, Star, Trash } from "lucide-react";
import { toast } from "sonner";
import { AlertModal } from "@/components/modals/alert-modal";

interface ProductActionsProps {
  product: any;
}

export const ProductActions = ({ product }: ProductActionsProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const onToggleStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${product.id}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle product status");
      }

      const result = await response.json();
      
      toast.success(`Product ${result.isActive ? "activated" : "deactivated"} successfully`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onToggleFeatured = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${product.id}/toggle-featured`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle product featured status");
      }

      const result = await response.json();
      
      toast.success(`Product ${result.homePageFeatured ? "added to" : "removed from"} featured section`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      toast.success("Product deleted successfully");
      router.refresh();
      router.push("/admin/products");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
      setOpenDeleteModal(false);
    }
  };

  return (
    <>
      <AlertModal 
        isOpen={openDeleteModal} 
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={onDelete}
        loading={loading}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/products/${product.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" /> View details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/products/${product.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onToggleStatus}>
            <PowerOff className="mr-2 h-4 w-4" /> 
            {product.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleFeatured}>
            <Star className="mr-2 h-4 w-4" /> 
            {product.homePageFeatured ? "Remove from featured" : "Add to featured"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setOpenDeleteModal(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" /> Delete product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}; 