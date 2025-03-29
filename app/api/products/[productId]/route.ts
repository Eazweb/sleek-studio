import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { slugify } from "@/lib/utils";
import { uploadImage, deleteImage, getPublicIdFromUrl } from "@/lib/cloudinary";

const productUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  salePrice: z.number().optional().nullable(),
  inventory: z.number().int().nonnegative().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).or(z.string()).optional(),
  sizes: z.array(z.string()).or(z.string()).optional(),
  noBgImage: z.string().url().optional(),
  modelImage: z.string().url().optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  homePageFeatured: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { productId } = resolvedParams;
    
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    
    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        orderItems: {
          include: {
            order: true,
          },
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

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
    
    // Validate product exists
    const existingProduct = await db.product.findUnique({
      where: { id: productId },
    });
    
    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validationResult = productUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    const updateData: any = { ...data };
    
    // Process images if new ones are provided
    const images = [...(existingProduct.images || [])];
    let shouldReplaceImages = false;
    
    // Process no background image
    if (data.noBgImage && data.noBgImage !== existingProduct.noBgImage) {
      if (data.noBgImage.startsWith('data:')) {
        // Upload new image
        const uploadResult = await uploadImage(data.noBgImage);
        updateData.noBgImage = uploadResult.url;
        
        // Mark the first image for replacement
        if (images.length > 0 && images[0] === existingProduct.noBgImage) {
          images[0] = uploadResult.url;
        } else {
          shouldReplaceImages = true; // Need to rebuild the images array
        }
        
        // Try to delete old image if it exists
        if (existingProduct.noBgImage) {
          const publicId = getPublicIdFromUrl(existingProduct.noBgImage);
          if (publicId) {
            try {
              await deleteImage(publicId);
            } catch (err) {
              console.error("Error deleting old image:", err);
            }
          }
        }
      }
    }
    
    // Process model image
    if (data.modelImage && data.modelImage !== existingProduct.modelImage) {
      if (data.modelImage.startsWith('data:')) {
        // Upload new image
        const uploadResult = await uploadImage(data.modelImage);
        updateData.modelImage = uploadResult.url;
        
        // Mark the second image for replacement
        if (images.length > 1 && images[1] === existingProduct.modelImage) {
          images[1] = uploadResult.url;
        } else {
          shouldReplaceImages = true; // Need to rebuild the images array
        }
        
        // Try to delete old image
        if (existingProduct.modelImage) {
          const publicId = getPublicIdFromUrl(existingProduct.modelImage);
          if (publicId) {
            try {
              await deleteImage(publicId);
            } catch (err) {
              console.error("Error deleting old image:", err);
            }
          }
        }
      }
    }
    
    // Handle additional images if provided
    if (data.images && Array.isArray(data.images)) {
      shouldReplaceImages = true;
      const newImages = [];
      
      // Keep the first two images (noBgImage and modelImage) if not modified
      if (!data.noBgImage && existingProduct.noBgImage) {
        newImages.push(existingProduct.noBgImage);
      } else if (data.noBgImage && !data.noBgImage.startsWith('data:')) {
        newImages.push(data.noBgImage);
      } else if (updateData.noBgImage) {
        newImages.push(updateData.noBgImage);
      }
      
      if (!data.modelImage && existingProduct.modelImage) {
        newImages.push(existingProduct.modelImage);
      } else if (data.modelImage && !data.modelImage.startsWith('data:')) {
        newImages.push(data.modelImage);
      } else if (updateData.modelImage) {
        newImages.push(updateData.modelImage);
      }
      
      // Process additional images
      for (const image of data.images) {
        if (image.startsWith('data:')) {
          const uploadResult = await uploadImage(image);
          newImages.push(uploadResult.url);
        } else {
          newImages.push(image);
        }
      }
      
      updateData.images = newImages;
    } else if (shouldReplaceImages) {
      // If we need to rebuild the images array but no new additional images were provided
      updateData.images = [];
      
      if (updateData.noBgImage || existingProduct.noBgImage) {
        updateData.images.push(updateData.noBgImage || existingProduct.noBgImage);
      }
      
      if (updateData.modelImage || existingProduct.modelImage) {
        updateData.images.push(updateData.modelImage || existingProduct.modelImage);
      }
      
      // Add any remaining images from the existing product
      if (existingProduct.images && existingProduct.images.length > 2) {
        updateData.images.push(...existingProduct.images.slice(2));
      }
    }
    
    // Process name and slug update
    if (data.name && data.name !== existingProduct.name) {
      const newSlug = slugify(data.name);
      
      // Check if the new slug already exists (except for this product)
      const slugExists = await db.product.findFirst({
        where: {
          slug: newSlug,
          id: { not: productId },
        },
      });
      
      updateData.slug = slugExists 
        ? `${newSlug}-${Math.floor(Math.random() * 1000)}`
        : newSlug;
    }
    
    // Process tags and sizes
    if (data.tags) {
      updateData.tags = Array.isArray(data.tags) 
        ? data.tags 
        : data.tags.split(',').map((tag: string) => tag.trim());
    }
    
    if (data.sizes) {
      updateData.sizes = Array.isArray(data.sizes) 
        ? data.sizes 
        : data.sizes.split(',').map((size: string) => size.trim());
    }
    
    // Update the product
    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: updateData,
    });
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    
    // Get product to delete
    const product = await db.product.findUnique({
      where: { id: productId },
    });
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    // Delete images from Cloudinary
    try {
      if (product.noBgImage) {
        const publicId = getPublicIdFromUrl(product.noBgImage);
        if (publicId) await deleteImage(publicId);
      }
      
      if (product.modelImage) {
        const publicId = getPublicIdFromUrl(product.modelImage);
        if (publicId) await deleteImage(publicId);
      }
      
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          if (
            image !== product.noBgImage && 
            image !== product.modelImage && 
            image
          ) {
            const publicId = getPublicIdFromUrl(image);
            if (publicId) await deleteImage(publicId);
          }
        }
      }
    } catch (error) {
      console.error("Error deleting images:", error);
      // Continue with product deletion even if image deletion fails
    }
    
    // Delete the product
    await db.product.delete({
      where: { id: productId },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
} 