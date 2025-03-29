"use client";

import { useRouter } from "next/navigation";
import { 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow, 
  Table 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Edit, 
  Power, 
  Star,
  ExternalLink,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ProductActions } from "./product-actions";

interface ProductTableProps {
  products: any[];
}

export const ProductTable = ({ products }: ProductTableProps) => {
  const router = useRouter();

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 bg-white p-8 rounded-md shadow">
        <div className="relative w-60 h-60 flex items-center justify-center rounded-md bg-gray-100">
          <div className="text-center p-5">
            <h3 className="mt-5 text-xl font-medium text-gray-900">No products found</h3>
            <p className="mt-2 text-sm text-gray-500">Create your first product to get started.</p>
          </div>
        </div>
        <Button onClick={() => router.push("/admin/products/new")}>
          Add New Product
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.images && product.images[0] ? (
                  <div className="relative h-12 w-12 overflow-hidden rounded-md">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-500">No image</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{product.name}</span>
                  <Link 
                    href={`/products/${product.slug}`} 
                    target="_blank"
                    className="flex items-center text-xs text-blue-600 hover:underline"
                  >
                    <span className="truncate max-w-[150px]">{product.slug}</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  {product.salePrice ? (
                    <>
                      <span className="text-sm font-medium">{formatPrice(product.salePrice)}</span>
                      <span className="text-xs text-gray-500 line-through">{formatPrice(product.price)}</span>
                    </>
                  ) : (
                    <span>{formatPrice(product.price)}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{product.category}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className={product.inventory <= 5 ? "text-red-500 font-medium" : ""}>
                    {product.inventory}
                  </span>
                  {product.inventory <= 5 && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      Low
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={product.isActive ? "default" : "secondary"}
                  className={product.isActive ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                {product.homePageFeatured ? (
                  <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                    Featured
                  </Badge>
                ) : (
                  <span className="text-sm text-gray-500">No</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <ProductActions product={product} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}; 