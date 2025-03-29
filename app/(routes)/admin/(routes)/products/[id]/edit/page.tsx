import { requireAdmin } from "@/lib/auth-utils";
import OopsMessage from "@/components/Others/OopsMessage";
import { ProductForm } from "../../components/product-form";
import { getProductById } from "@/actions/products";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Edit Product | Admin Dashboard",
  description: "Update product details and settings",
};

export default async function EditProductPage({ params }: EditProductPageProps) {
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
        <ProductForm initialData={product} />
      </div>
    </div>
  );
} 