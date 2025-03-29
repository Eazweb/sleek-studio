import { requireAdmin } from "@/lib/auth-utils";
import OopsMessage from "@/components/Others/OopsMessage";
import { ProductForm } from "../components/product-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Product | Admin Dashboard",
  description: "Create a new product for your store",
};

export default async function NewProductPage() {
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

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm />
      </div>
    </div>
  );
} 