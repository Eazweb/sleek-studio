"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, X } from "lucide-react";
import { CouponTable } from "./coupon-table";
import { Input } from "../../../../../../components/ui/input";
import {Button} from '../../../../../../components/ui/button'

interface CouponClientProps {
  data: any[];
  pagination: {
    page: number;
    pageSize: number;
    totalCoupons: number;
    totalPages: number;
  };
}

export const CouponClient: React.FC<CouponClientProps> = ({
  data,
  pagination,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams?.get("search") || "");

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new URLSearchParams
    const params = new URLSearchParams(searchParams?.toString());
    
    // Update search parameter
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    
    // Reset to page 1 when searching
    params.set("page", "1");
    
    // Navigate with new params
    router.push(`/admin/coupons?${params.toString()}`);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    const params = new URLSearchParams(searchParams?.toString());
    params.delete("search");
    params.set("page", "1");
    router.push(`/admin/coupons?${params.toString()}`);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("page", newPage.toString());
    router.push(`/admin/coupons?${params.toString()}`);
  };

  const isFiltered = searchParams?.has("search");

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search coupons..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <X
                  className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground cursor-pointer"
                  onClick={() => setSearchTerm("")}
                />
              )}
            </div>
            <Button type="submit" size="sm" variant="secondary">
              Search
            </Button>
            {isFiltered && (
              <Button variant="ghost" size="sm" onClick={clearSearch}>
                Reset
              </Button>
            )}
          </form>
        </div>
        <Button onClick={() => router.push("/admin/coupons/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <div className="mt-4">
        <CouponTable 
          data={data} 
          pagination={pagination}
          onPageChange={handlePageChange}
          onStatusToggle={() => {}} // Placeholder, now handled in actions component
          isLoading={isLoading}
        />
      </div>
    </>
  );
}; 