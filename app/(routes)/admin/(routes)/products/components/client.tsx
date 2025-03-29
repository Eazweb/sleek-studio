"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { ProductTable } from "./product-table";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";

interface ProductClientProps {
  products: any[];
  categories: string[];
  totalPages: number;
  currentPage: number;
}

export const ProductClient = ({
  products,
  categories,
  totalPages,
  currentPage,
}: ProductClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(
    searchParams?.get("search") || ""
  );
  
  const category = searchParams?.get("category") || "all";
  const status = searchParams?.get("status") || "all";

  const createQueryString = (params: Record<string, string | number | null>) => {
    const newParams = new URLSearchParams(searchParams?.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    
    return newParams.toString();
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    router.push(
      `/admin/products?${createQueryString({
        search: searchQuery || null,
        page: 1
      })}`
    );
  };

  const onCategoryChange = (value: string) => {
    router.push(
      `/admin/products?${createQueryString({
        category: value === "all" ? null : value,
        page: 1
      })}`
    );
  };

  const onStatusChange = (value: string) => {
    router.push(
      `/admin/products?${createQueryString({
        status: value,
        page: 1
      })}`
    );
  };

  const onPageChange = (page: number) => {
    router.push(
      `/admin/products?${createQueryString({
        page
      })}`
    );
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${products.length})`}
          description="Manage your store products"
        />
        <Button onClick={() => router.push("/admin/products/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <form onSubmit={onSearch} className="sm:col-span-2 flex items-center gap-2">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
          <div className="grid grid-cols-2 gap-2">
            <Select value={category} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <ProductTable products={products} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </>
  );
}; 