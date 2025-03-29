import { requireAdmin } from "@/lib/auth-utils";
import OopsMessage from "@/components/Others/OopsMessage";
import { getProductById } from "@/actions/products";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Product Details | Admin Dashboard",
  description: "View and edit product details",
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { isAuthorized, errorMessage } = await requireAdmin();
  
  // If not authorized, show the OopsMessage
  if (!isAuthorized) {
    return errorMessage ? (
      <OopsMessage
        message={errorMessage.message}
        title={errorMessage.title}
        backUrl={errorMessage.backUrl}
        backText={errorMessage.backText}
      />
    ) : null;
  }

  // Resolve params
  const resolvedParams = await params;
  
  // Fetch product data
  const product = await getProductById(resolvedParams.id);
  
  if (!product) {
    return notFound();
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title={product.name}
            description="View product details and performance"
          />
          <Link href={`/admin/products/${product.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
        <Separator />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Images */}
          <div className="col-span-1 space-y-4">
            <div className="bg-white rounded-md p-4 shadow-sm">
              <h2 className="text-lg font-medium mb-4">Product Images</h2>
              <div className="space-y-4">
                {product.images && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <div key={index} className="relative h-48 w-full rounded-md overflow-hidden">
                      <Image
                        src={image}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ))
                ) : (
                  <div className="h-48 w-full bg-gray-100 flex items-center justify-center rounded-md">
                    <span className="text-gray-500">No images available</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="col-span-2 space-y-4">
            <div className="bg-white rounded-md p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Product Name</h3>
                  <p className="mt-1">{product.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Slug</h3>
                  <p className="mt-1">{product.slug}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <p className="mt-1">{formatPrice(product.price)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Sale Price</h3>
                  <p className="mt-1">{product.salePrice ? formatPrice(product.salePrice) : "No sale"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="mt-1">
                    <Badge variant="outline">{product.category}</Badge>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    <Badge 
                      variant={product.isActive ? "default" : "secondary"}
                      className={product.isActive ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {product.homePageFeatured && (
                      <Badge variant="default" className="ml-2 bg-amber-500">Featured</Badge>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Inventory</h3>
                  <p className="mt-1">
                    <span className={product.inventory <= 5 ? "text-red-500 font-medium" : ""}>
                      {product.inventory} in stock
                    </span>
                    {product.inventory <= 5 && (
                      <Badge variant="destructive" className="ml-2">Low Stock</Badge>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Times Sold</h3>
                  <p className="mt-1">{product.timesSold} units</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                  <p className="mt-1">{formatDate(product.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="mt-1">{formatDate(product.updatedAt)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-md p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">Product Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 whitespace-pre-line">{product.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Available Sizes</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {product.sizes && product.sizes.length > 0 ? (
                      product.sizes.map((size) => (
                        <Badge key={size} variant="outline">
                          {size}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">No sizes specified</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {product.tags && product.tags.length > 0 ? (
                      product.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">No tags</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-md p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">Recent Orders</h2>
              
              {product.orderItems && product.orderItems.length > 0 ? (
                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {product.orderItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Link href={`/admin/orders/${item.order.id}`} className="text-blue-600 hover:underline">
                              {item.order.id.substring(0, 8)}...
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatPrice(item.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              variant={
                                item.order.status === "DELIVERED" 
                                  ? "default" 
                                  : item.order.status === "CANCELLED" 
                                    ? "destructive" 
                                    : "default"
                              }
                              className={`capitalize ${
                                item.order.status === "DELIVERED" ? "bg-green-500 hover:bg-green-600" : ""
                              }`}
                            >
                              {item.order.status.toLowerCase()}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No orders found for this product
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-md p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">
                Product Reviews ({product.reviews ? product.reviews.length : 0})
              </h2>
              
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="mr-3">
                            {review.user.image ? (
                              <div className="h-10 w-10 rounded-full overflow-hidden relative">
                                <Image
                                  src={review.user.image}
                                  alt={review.user.name || "User"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 font-medium">
                                  {review.user.name ? review.user.name.charAt(0).toUpperCase() : "U"}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{review.user.name || "Anonymous"}</h3>
                            <div className="flex items-center">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 15.934l-6.18 3.254 1.179-6.875-5-4.867 6.902-1.002L10 0l3.099 6.444 6.902 1.002-5 4.867 1.179 6.875z"
                                    />
                                  </svg>
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-500">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No reviews yet for this product
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 