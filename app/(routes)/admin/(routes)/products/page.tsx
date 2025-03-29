import OopsMessage from '@/components/Others/OopsMessage';
import { requireAdmin } from '@/lib/auth-utils';
import { getAdminProducts } from '@/actions/products';
import { db } from '@/lib/db';
import { ProductClient } from './components/client';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Products | Admin Dashboard",
  description: "Manage your store products",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
    status?: string;
  };
}) {
  const { isAuthorized, user, errorMessage } = await requireAdmin();
  
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

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const search = searchParams.search || "";
  const category = searchParams.category || "";  // Empty string means no filter in the server actions
  const status = (searchParams.status || "all") as "active" | "inactive" | "all";

  // Fetch products with pagination and filters
  const { products, totalCount, totalPages, currentPage } = await getAdminProducts({
    page,
    search,
    category,
    status,
    limit: 10,
  });

  // Get unique categories for the filter
  const categories = await db.product.findMany({
    select: {
      category: true,
    },
    distinct: ['category'],
  });

  const uniqueCategories = categories.map(c => c.category);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductClient 
            products={products} 
            categories={uniqueCategories}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </Suspense>
      </div>
    </div>
  );
}