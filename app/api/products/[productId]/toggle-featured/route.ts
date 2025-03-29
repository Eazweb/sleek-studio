import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { productId } = resolvedParams;
    
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Find the product
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { homePageFeatured: true },
    });
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    // Toggle the featured status
    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: {
        homePageFeatured: !product.homePageFeatured,
      },
    });
    
    return NextResponse.json({
      success: true,
      homePageFeatured: updatedProduct.homePageFeatured,
    });
  } catch (error) {
    console.error("Error toggling product featured status:", error);
    return NextResponse.json(
      { error: "Failed to update product featured status" },
      { status: 500 }
    );
  }
} 